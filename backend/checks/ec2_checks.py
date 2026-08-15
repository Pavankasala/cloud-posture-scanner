def check_ssh_rdp_exposure(security_groups):
    findings = []

    for security_group in security_groups:
        exposed_ports = []

        for permission in security_group["permissions"]:
            protocol = permission.get("IpProtocol")

            # -1 means all traffic
            if protocol == "-1":
                public_ipv4 = any(
                    ip_range.get("CidrIp") == "0.0.0.0/0"
                    for ip_range in permission.get("IpRanges", [])
                )

                public_ipv6 = any(
                    ip_range.get("CidrIpv6") == "::/0"
                    for ip_range in permission.get("Ipv6Ranges", [])
                )

                if public_ipv4 or public_ipv6:
                    exposed_ports.append("ALL")

                continue

            if protocol != "tcp":
                continue

            from_port = permission.get("FromPort")
            to_port = permission.get("ToPort")

            if from_port is None or to_port is None:
                continue

            # Check whether the SSH/RDP ports fall inside the allowed range
            protected_ports = []

            if from_port <= 22 <= to_port:
                protected_ports.append(22)

            if from_port <= 3389 <= to_port:
                protected_ports.append(3389)

            if not protected_ports:
                continue

            # IPv4 and IPv6 public access
            public_ipv4 = any(
                ip_range.get("CidrIp") == "0.0.0.0/0"
                for ip_range in permission.get("IpRanges", [])
            )

            public_ipv6 = any(
                ip_range.get("CidrIpv6") == "::/0"
                for ip_range in permission.get("Ipv6Ranges", [])
            )

            if public_ipv4 or public_ipv6:
                exposed_ports.extend(protected_ports)

        if exposed_ports:
            ports = ", ".join(str(port) for port in sorted(set(exposed_ports), key=str))

            findings.append({
                "check_id": "EC2_SSH_RDP_EXPOSURE",
                "resource": security_group["group_id"],
                "status": "FAIL",
                "message": f"Security group exposes TCP port(s) {ports} publicly."
            })
        else:
            findings.append({
                "check_id": "EC2_SSH_RDP_EXPOSURE",
                "resource": security_group["group_id"],
                "status": "PASS",
                "message": "Security group does not publicly expose SSH or RDP."
            })

    return findings