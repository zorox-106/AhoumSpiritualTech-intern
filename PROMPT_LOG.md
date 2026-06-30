# Prompt Log

This project was built with the assistance of **Antigravity**, an advanced AI coding assistant. The AI was utilized to accelerate development, troubleshoot errors, design the architecture, and refine the code base.

Below is a curated log of the **most valuable prompts** that significantly drove the project's development, architecture, and feature integration.

## 1. Project Architecture & Initialization
**Prompt:**
`so do it as it is what said in this screenshots`

**Purpose:**
To kickstart the initial development based on design mockups and assignment requirements provided via screenshots.

**Outcome:**
The AI analyzed the visual requirements and generated the foundational architecture. It initialized the React (Vite) frontend, Django REST Framework backend, and set up the complete Docker orchestration (docker-compose) with a PostgreSQL database.

## 2. Payment Gateway Integration
**Prompt:**
`this is my sstripe api key rk_test_51Tnm... integrate this`

**Purpose:**
To integrate a real-world payment gateway for the session booking flow using the provided Stripe API keys.

**Outcome:**
The AI securely implemented the Stripe Checkout flow in both the Django backend (creating checkout sessions) and the React frontend, allowing users to successfully mock-pay for spiritual sessions.

## 3. Complex UI Refactoring & Bug Fixing
**Prompt:**
`ye aara bs ab and github ka htade auth and ye seassion firse nhi dikh rhe ab isko thik kr and photos jo seasson me aa rhi h vo htade`

**Purpose:**
To simultaneously handle UI refinements (removing GitHub auth, removing unsupported photos) and troubleshoot a critical backend crash causing sessions to disappear.

**Outcome:**
The AI seamlessly handled the multi-part request. It disabled the GitHub OAuth flow in the UI, diagnosed a `500 Server Error` caused by an invalid database serializer field (`creator_details`), removed the unused `image_url` fields, and pushed the fixes to production, restoring full functionality.
