# Security Specification: EcoFriend database Security

## 1. Data Invariants
- **User profiles:** A user profile document must match the authenticating user (uid == document path userId). Email-verified check must be active. Users cannot change their own email or registration metadata after creation.
- **Sowed Seeds:** A seed record must reside under `/users/{userId}/seeds/{seedId}` where userId matches the currently authenticated student (request.auth.uid). The `status` field must be restricted to enum values. Modifying the `userId` or `seedId` after creation is forbidden.
- **Activity Logs:** All gardening entries must be owned by the student (`userId == request.auth.uid`) and have a server timestamp.

## 2. The "Dirty Dozen" Malicious Payloads

### User Profiles Collection
1. **Malicious Payload 1 (Identity Spoofing):** Non-owner attempts to write user details to `users/anotherUserUid`.
2. **Malicious Payload 2 (Mutable Email/Date):** Writing a future timestamp as `createdAt` or changing `email` on update.
3. **Malicious Payload 3 (Super-large input):** Setting name or grade to an extremely large string to crash layouts or consume disk size.

### Sowed Seeds Collection
4. **Malicious Payload 4 (Orphaned Seed Write):** Saving a seed record where `userId` doesn't match the current user.
5. **Malicious Payload 5 (State Shortcutting):** Skipping agricultural status or trying to inject unvetted enum string.
6. **Malicious Payload 6 (Id Poisoning / Path Bypass):** Creating seed with a massive 100KB string id or invalid pattern to bypass lookup indexes.
7. **Malicious Payload 7 (Immortal field drift):** Changing the original seed's `sowedDate` or `plantName` during a standard update.
8. **Malicious Payload 8 (Temporal Invariant Bypass):** Sending user-crafted client timestamps for `createdAt` instead of a server timestamp.

### Activity Logs Collection
9. **Malicious Payload 9 (PII Leakage attack):** Reading other student's activity logs or performing a blanket index scan without restricting search queries to the user's owner-id.
10. **Malicious Payload 10 (Spoofed ID):** Injecting system activity indicators mimicking teacher approvals from client inputs.
11. **Malicious Payload 11 (Unbounded List Attack):** Pushing large mock lists to create memory resource exhaustion.
12. **Malicious Payload 12 (Anonymous Privilege Escalation):** Anonymous (unverified) user attempts write commands when verified classroom emails are strictly mandated.

## 3. Recommended Security Test Logic
A test runner should verify each of these 12 cases returns a permission-denied response.
