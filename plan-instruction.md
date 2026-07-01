# Master Implementation Plan

## AI Development Instructions for Codex

### Purpose

This document defines the implementation strategy for the application. It is not merely a feature list—it is the governing document for how development should proceed.

The AI must prioritize architectural correctness, database integrity, usability, maintainability, and requirement completeness over simply implementing visible features.

The objective is to produce a production-quality application where every page, feature, role, and database table works together logically.

---

# General Development Rules

The AI must **NOT** implement everything at once.

Instead, it should:

1. Analyze the current project.
2. Determine the best implementation order.
3. Break work into small, independent milestones.
4. Break each milestone into micro-tasks.
5. Complete one milestone.
6. Review its work.
7. Present a summary.
8. Ask for confirmation.
9. Wait for approval before continuing.

The implementation order should be determined by engineering dependency, **not** by the order written in this document.

---

# Required Development Workflow

For every phase, the AI must follow this workflow:

## Step 1

Analyze current implementation.

Identify:

* existing functionality
* missing functionality
* technical debt
* duplicated logic
* inconsistent database structure
* broken UI
* broken routing
* authentication issues
* authorization issues

---

## Step 2

Explain findings.

Provide:

* Current state
* Problems found
* Proposed solution
* Reasoning
* Risks

---

## Step 3

Break implementation into micro-tasks.

Example:

Phase

↓

Milestone

↓

Task

↓

Subtask

No implementation should exceed a manageable scope.

---

## Step 4

Implement only that milestone.

Do not continue automatically.

---

## Step 5

Review.

Report:

Completed

Remaining

Files changed

Database changes

New API endpoints

New UI

Potential risks

---

## Step 6

Stop.

Wait for approval before continuing.

---

# Highest Priority

The following priorities override every other feature.

---

## Priority 1

Database Architecture

The database is the most important part of the project.

Everything else depends on it.

Review the existing schema.

Determine whether it supports:

* Users
* Vendors
* Stores
* Menu items
* Routes
* Saved routes
* Reviews
* Comments
* Search history
* Authentication
* Authorization
* Roles
* Admin logs
* Backup
* Recovery
* Scheduling
* Vendor onboarding
* Activity logging

If relationships are weak, redesign them before implementing more features.

Every table must have a clear purpose.

Every relationship must be logical.

No orphan records.

No duplicated responsibilities.

Every store must belong to a vendor.

Every vendor must own stores.

Every user must have the correct role.

---

## Priority 2

Authentication & Authorization

Review the entire authentication system.

Ensure:

* login
* registration
* session handling
* JWT/session validation
* route protection
* middleware
* role-based authorization

Roles must map correctly.

Consumer

↓

User application

Vendor

↓

Vendor application

Global Admin

↓

Admin application

Developer

↓

Developer tools

Business Assistant

↓

Business management tools

Guest users should only have public functionality.

Protected features must not be accessible without authorization.

---

## Priority 3

Requirement Verification

Review the attached PDF.

Review existing application.

If documentation contradicts implementation:

Prefer the current application as the baseline.

Then reconcile the remaining requirements.

The finished system should satisfy all required project requirements.

---

# Cross-System Requirements

All three applications must behave consistently.

User

Vendor

Admin

should share:

* design language
* spacing
* typography
* navigation
* icon style
* branding
* responsive behavior

Different icons should represent different actions.

Avoid repeated icons for unrelated functions.

Layouts should feel consistent across the system.

Performance should remain smooth.

---

# User Application Requirements

Implement and improve:

Route customization

Current location support

Source/destination validation

Route validation

Error handling

Guest vs registered permissions

Saved routes

History

Reviews

Comments

Interactive map markers

Marker highlighting

Detail popups

Vendor information display

Menu display

Price

Description

Feature display

Database-connected information only

Improve UI/UX throughout.

---

# Vendor Application Requirements

Maintain all existing functionality.

Improve:

Layout

User experience

Navigation

Responsiveness

Remove analytics chart from dashboard.

Fix full-screen map rendering.

Pinpoint selection must work in both normal and fullscreen mode.

Apply the same map fix to Admin.

Vendor data must synchronize correctly with database.

Everything entered by vendors must appear correctly on the user application.

---

# Global Admin Requirements

Global Admin is the highest administrator.

Responsible for:

Developer management

Business Assistant management

Vendor management

Role management

System monitoring

Database management

Improve:

Dashboard

Database activity

Query tools

Error pages

Bug pages

Onboarding support

Remove confusing pages.

Redesign static pages into useful operational pages.

Dashboard should summarize meaningful system information.

Query tools should be simplified.

Database activity should provide useful logs.

Error pages should provide actionable information.

---

# Future Admin Roles

Developer

Business Assistant

should become independent interfaces later.

Do NOT build these first.

Complete Global Admin first.

---

# Backup & Recovery

Developer tools must include:

Manual backup

Scheduled backup

Recovery

Recovery confirmation

Backup logs

Recovery logs

Status

Scheduling

Retention

Error handling

These should function as operational tools rather than placeholder dashboards.

---

# Database Rules

Every feature must connect to database logic.

Every database table must support a real feature.

Avoid:

dead tables

unused columns

duplicate tables

broken foreign keys

broken ownership

Review entire schema before implementation.

---

# UI/UX Standards

Across every application:

consistent spacing

consistent headers

consistent sidebars

consistent branding

clean forms

clear tables

clear dashboards

good responsiveness

smooth interactions

professional layout

Optimize usability before adding visual complexity.

---

# Engineering Principles

Prefer:

Maintainability

Scalability

Consistency

Readability

Modularity

Reusable components

Reusable services

Reusable APIs

Avoid duplicated code.

---

# Phase Completion Checklist

Every phase must finish with:

Completed tasks

Remaining tasks

Database modifications

API modifications

UI modifications

Testing completed

Known issues

Risk assessment

Recommendation

Then stop.

Wait for approval.

Do not continue automatically.

---

# AI Decision Rules

Before implementing anything, always ask:

Is this dependent on another feature?

Should the database change first?

Does authentication affect this?

Does authorization affect this?

Will this break another module?

Can this be implemented independently?

Should it become its own milestone?

If yes,

split it further.

---

# Final Objective

The final system should:

* Fully satisfy the project requirements.
* Use a complete and logically designed database.
* Correctly implement authentication and authorization.
* Provide consistent UI/UX across User, Vendor, and Admin applications.
* Ensure every feature is connected to real database logic.
* Be modular, maintainable, scalable, and production-ready.
* Progress through small, reviewable milestones with user approval required before each subsequent phase.
