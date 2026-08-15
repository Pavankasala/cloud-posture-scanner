import json
from unittest.mock import patch, MagicMock
import pytest
from botocore.exceptions import ClientError
from backend.storage import save_scan_results, load_latest_scan_results


def test_save_scan_results_no_bucket_env(monkeypatch):
    monkeypatch.delenv("SCAN_REPORT_BUCKET", raising=False)
    report = {"summary": {"total": 1, "passed": 1, "failed": 0}}
    
    result = save_scan_results(report)
    
    assert result["stored"] is False
    assert "not configured" in result["reason"]


def test_save_scan_results_success(monkeypatch):
    monkeypatch.setenv("SCAN_REPORT_BUCKET", "my-test-report-bucket")
    report = {"summary": {"total": 1, "passed": 1, "failed": 0}}
    
    mock_s3 = MagicMock()
    with patch("boto3.client", return_value=mock_s3):
        result = save_scan_results(report)

        assert result["stored"] is True
        assert result["bucket"] == "my-test-report-bucket"
        assert result["key"] == "latest_scan.json"
        
        mock_s3.put_object.assert_called_once_with(
            Bucket="my-test-report-bucket",
            Key="latest_scan.json",
            Body=json.dumps(report, indent=2),
            ContentType="application/json"
        )


def test_save_scan_results_s3_failure(monkeypatch):
    monkeypatch.setenv("SCAN_REPORT_BUCKET", "my-test-report-bucket")
    report = {"summary": {"total": 1, "passed": 1, "failed": 0}}
    
    mock_s3 = MagicMock()
    error_response = {"Error": {"Code": "NoSuchBucket", "Message": "The specified bucket does not exist"}}
    mock_s3.put_object.side_effect = ClientError(error_response, "PutObject")

    with patch("boto3.client", return_value=mock_s3):
        with pytest.raises(RuntimeError) as exc_info:
            save_scan_results(report)

        assert "Failed to persist scan results to S3 bucket" in str(exc_info.value)


def test_load_latest_scan_results_success(monkeypatch):
    monkeypatch.setenv("SCAN_REPORT_BUCKET", "my-test-report-bucket")
    report_data = {"summary": {"total": 2, "passed": 2, "failed": 0}}

    mock_body = MagicMock()
    mock_body.read.return_value = json.dumps(report_data).encode("utf-8")
    
    mock_s3 = MagicMock()
    mock_s3.get_object.return_value = {"Body": mock_body}

    with patch("boto3.client", return_value=mock_s3):
        loaded = load_latest_scan_results()

        assert loaded == report_data
        mock_s3.get_object.assert_called_once_with(
            Bucket="my-test-report-bucket",
            Key="latest_scan.json"
        )


def test_load_latest_scan_results_not_found(monkeypatch):
    monkeypatch.setenv("SCAN_REPORT_BUCKET", "my-test-report-bucket")
    
    mock_s3 = MagicMock()
    error_response = {"Error": {"Code": "NoSuchKey", "Message": "The specified key does not exist"}}
    mock_s3.get_object.side_effect = ClientError(error_response, "GetObject")

    with patch("boto3.client", return_value=mock_s3):
        loaded = load_latest_scan_results()

        assert loaded is None
