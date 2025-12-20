# IP Address & Networking Guide

A comprehensive guide to understanding IPv4 addresses, subnetting, and network fundamentals.

## Table of Contents

- [IPv4 Address Basics](#ipv4-address-basics)
- [Network ID vs Host ID](#network-id-vs-host-id)
- [Subnet Masks](#subnet-masks)
- [CIDR Notation](#cidr-notation)
- [Public vs Private IP Addresses](#public-vs-private-ip-addresses)
- [Special Addresses](#special-addresses)
- [Binary Math Fundamentals](#binary-math-fundamentals)
- [IP Address Classes](#ip-address-classes)

## IPv4 Address Basics

An IPv4 address consists of **32 bits**, divided into **4 octets** (8 bits each).

- **8 bits** → 2⁸ = **256 values** (0–255)

### Example: 192.168.10.1

```
Decimal:  192     168     10      1
Binary:   11000000.10101000.00001010.00000001
```

**Breakdown:**
- `192` = `11000000`
- `168` = `10101000` 
- `10`  = `00001010`
- `1`   = `00000001`

## Network ID vs Host ID

Every IPv4 address is divided into two portions:
- **Network portion** → Identifies the network
- **Host portion** → Identifies the device within that network

### Example: 192.168.1.10/24

```
Binary breakdown:
Network: 11000000.10101000.00000001
Host:    00001010
```

### Special Host Values

⚠️ **Two host values are reserved and cannot be assigned to devices:**

- **All 0s** → Network address (e.g., `192.168.1.0`)
- **All 1s** → Broadcast address (e.g., `192.168.1.255`)

## Subnet Masks

A subnet mask determines which bits belong to the network portion of an IP address.

### Example: 255.255.255.0

```
Decimal: 255.255.255.0
Binary:  11111111.11111111.11111111.00000000
```

This represents a `/24` network:
- **24 network bits** (indicated by 1s)
- **8 host bits** (indicated by 0s)

### Rule of Subnet Masks
- **Network bits** → Continuous 1s
- **Host bits** → Continuous 0s
- **No mixing allowed** (must be contiguous)

## CIDR Notation

**CIDR (Classless Inter-Domain Routing)** provides flexible network addressing without rigid class boundaries.

### Example: 192.168.1.0/26

**Breakdown:**
- `/26` means **26 bits** for network, **6 bits** for host
- **Usable hosts** = 2⁶ - 2 = **62 hosts**
- **Binary mask**: `11111111.11111111.11111111.11000000`

> 💡 CIDR allows precise network design instead of wasting addresses with traditional classful addressing.

## Public vs Private IP Addresses

Some IP address ranges are **not routable** on the public internet.

### Private IP Ranges

| Range | CIDR Notation | Description |
|-------|---------------|-------------|
| `10.0.0.0` - `10.255.255.255` | `10.0.0.0/8` | Class A private range |
| `172.16.0.0` - `172.31.255.255` | `172.16.0.0/12` | Class B private range |
| `192.168.0.0` - `192.168.255.255` | `192.168.0.0/16` | Class C private range |

> 🔄 These addresses live behind **NAT** (Network Address Translation), where routers translate between private and public addresses.

## Special Addresses

| Address | Purpose |
|---------|---------|
| `127.0.0.1` | **Loopback** (localhost - talking to yourself) |
| `0.0.0.0` | **Unspecified address** / default route |
| `255.255.255.255` | **Limited broadcast** address |

> 🤔 **Fun fact:** Loopback is the network equivalent of thinking aloud!

## Binary Math Fundamentals

Subnetting relies heavily on **powers of 2**.

### Powers of 2 Table

| Bits | Values | Binary |
|------|--------|--------|
| 1 | 2 | 10 |
| 2 | 4 | 100 |
| 3 | 8 | 1000 |
| 4 | 16 | 10000 |
| 5 | 32 | 100000 |
| 6 | 64 | 1000000 |
| 7 | 128 | 10000000 |
| 8 | 256 | 100000000 |

### Usable Hosts Formula

```
Usable Hosts = 2^(host bits) - 2
```

**Why subtract 2?**
1. **Network address** (all host bits = 0)
2. **Broadcast address** (all host bits = 1)

## IP Address Classes

> ⚠️ **Note:** Classful addressing is largely obsolete, replaced by CIDR. However, understanding classes helps with legacy systems and exam preparation.

### Class A
- **Range:** `1.0.0.0` – `126.255.255.255`
- **First bit:** `0`
- **Network bits:** 8
- **Host bits:** 24
- **Hosts per network:** 16,777,214
- **Binary pattern:** `0xxxxxxx.xxxxxxxx.xxxxxxxx.xxxxxxxx`

### Class B
- **Range:** `128.0.0.0` – `191.255.255.255`
- **First bits:** `10`
- **Network bits:** 16
- **Host bits:** 16
- **Hosts per network:** 65,534
- **Binary pattern:** `10xxxxxx.xxxxxxxx.xxxxxxxx.xxxxxxxx`

### Class C
- **Range:** `192.0.0.0` – `223.255.255.255`
- **First bits:** `110`
- **Network bits:** 24
- **Host bits:** 8
- **Hosts per network:** 254
- **Binary pattern:** `110xxxxx.xxxxxxxx.xxxxxxxx.xxxxxxxx`

### Class D (Multicast)
- **Range:** `224.0.0.0` – `239.255.255.255`
- **First bits:** `1110`
- **Purpose:** Multicast traffic, not host addressing

### Class E (Experimental)
- **Range:** `240.0.0.0` – `255.255.255.255`
- **First bits:** `1111`
- **Status:** Reserved for experimental use, not used in normal networking

---

*This guide provides a foundation for understanding IP addressing and subnetting. Master these concepts and you'll be well-equipped for network administration and design.*