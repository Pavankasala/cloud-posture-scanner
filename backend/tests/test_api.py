from unittest.mock import patch
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)


def test_api_endpoints_empty():
    import backend.main as main_module
    main_module.latest_scan = None

    with patch("backend.main.load_latest_scan_results", return_value=None):
        resp_inst = client.get("/instances")
        assert resp_inst.status_code == 200
        assert resp_inst.json() == {"instances": []}

        resp_buckets = client.get("/buckets")
        assert resp_buckets.status_code == 200
        assert resp_buckets.json() == {"buckets": []}

        resp_cis = client.get("/cis-results")
        assert resp_cis.status_code == 200
        assert resp_cis.json() == {
            "summary": {"total": 0, "passed": 0, "failed": 0},
            "findings": []
        }


def test_api_endpoints_populated():
    mock_scan_data = {
        "summary": {"total": 1, "passed": 1, "failed": 0},
        "instances": [{"instance_id": "i-12345"}],
        "buckets": [{"name": "test-bucket"}],
        "findings": [{"check_id": "S3_ENCRYPTION", "status": "PASS"}]
    }

    import backend.main as main_module
    main_module.latest_scan = mock_scan_data

    resp_inst = client.get("/instances")
    assert resp_inst.status_code == 200
    assert resp_inst.json() == {"instances": [{"instance_id": "i-12345"}]}

    resp_buckets = client.get("/buckets")
    assert resp_buckets.status_code == 200
    assert resp_buckets.json() == {"buckets": [{"name": "test-bucket"}]}

    resp_cis = client.get("/cis-results")
    assert resp_cis.status_code == 200
    assert resp_cis.json() == {
        "summary": {"total": 1, "passed": 1, "failed": 0},
        "findings": [{"check_id": "S3_ENCRYPTION", "status": "PASS"}]
    }
