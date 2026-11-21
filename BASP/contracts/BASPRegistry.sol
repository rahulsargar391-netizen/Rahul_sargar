// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title BASPRegistry (DRAFT for Phase 9, not yet compiled, tested or deployed)
/// @notice Stores the SHA-256 hash of approved certificates on an Ethereum TEST network.
/// Only the owner (the BASP backend wallet) may record. Anyone may read.
contract BASPRegistry {
    struct Record {
        bytes32 fileHash;   // SHA-256 of the certificate file
        uint64 recordedAt;  // block timestamp
        bool revoked;       // true if the certificate was revoked later
        bool exists;
    }

    address public owner;
    mapping(string => Record) private records; // key: certificate code, e.g. "BASP-9F3A1C0B7E"

    event CertificateRecorded(string certCode, bytes32 fileHash, uint64 recordedAt);
    event CertificateRevoked(string certCode);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can do this");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function recordCertificate(string calldata certCode, bytes32 fileHash) external onlyOwner {
        require(!records[certCode].exists, "Certificate already recorded");
        records[certCode] = Record(fileHash, uint64(block.timestamp), false, true);
        emit CertificateRecorded(certCode, fileHash, uint64(block.timestamp));
    }

    function revokeCertificate(string calldata certCode) external onlyOwner {
        require(records[certCode].exists, "Certificate not found");
        records[certCode].revoked = true;
        emit CertificateRevoked(certCode);
    }

    /// @return exists whether a record exists, matches whether the hash is identical, revoked its status
    function verify(string calldata certCode, bytes32 fileHash)
        external
        view
        returns (bool exists, bool matches, bool revoked)
    {
        Record memory r = records[certCode];
        return (r.exists, r.exists && r.fileHash == fileHash, r.revoked);
    }
}
