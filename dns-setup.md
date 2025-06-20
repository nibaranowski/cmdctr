# DNS Setup for cmdctr.dev with Zoho Mail

## Step 1: Add Domain in Vercel Dashboard
1. Go to the opened Vercel dashboard
2. Click "Add Domain"
3. Enter: `cmdctr.dev`
4. Follow the verification steps

## Step 2: Add DNS Records in Vercel

### Zoho Mail Verification TXT Record
- **Name**: Leave blank (or `@`)
- **Type**: TXT
- **Value**: `zoho-verification=zb08290960.zmverify.zoho.eu`
- **TTL**: 3600

### MX Records for Email Delivery
**Record 1:**
- **Name**: Leave blank (or `@`)
- **Type**: MX
- **Value**: `mx.zoho.com`
- **Priority**: 10
- **TTL**: 3600

**Record 2:**
- **Name**: Leave blank (or `@`)
- **Type**: MX
- **Value**: `mx2.zoho.com`
- **Priority**: 20
- **TTL**: 3600

## Step 3: Verify Domain
1. Wait 5-10 minutes for DNS propagation
2. Go back to Zoho Mail setup
3. Click "Verify TXT Record"

## Step 4: Create Email Account
1. Once verified, create the email account: `nic@cmdctr.dev`
2. Set up your password
3. Configure email client settings

## DNS Records Summary
```
TXT  @  zoho-verification=zb08290960.zmverify.zoho.eu
MX   @  mx.zoho.com (Priority: 10)
MX   @  mx2.zoho.com (Priority: 20)
``` 