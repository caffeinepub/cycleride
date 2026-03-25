# CycleRide

## Current State
CycleRide is a ride-booking app for cycle rides. It has a HeroSection with a booking form, RidersSection showing available riders, PricingSection with plans, live GPS tracking, and auth. All vehicle types currently are cycles only.

## Requested Changes (Diff)

### Add
- Vehicle type selector in the booking form (HeroSection): Cycle, Electric Scooter, Electric Auto, Electric Car
- Each vehicle type has a distinct icon/label
- Vehicle type tabs/filter in RidersSection so users can browse riders by vehicle type
- Fallback rider data for electric scooter, electric auto, and electric car categories
- Pricing section updated with plans for electric vehicle categories (or separate pricing rows)

### Modify
- HeroSection booking form: add vehicle type selector above or below the location inputs; "REQUEST A CYCLE" button text changes to reflect selected vehicle type
- RidersSection: add tab row for vehicle categories (Cycle, E-Scooter, E-Auto, E-Car), each tab shows relevant riders
- PricingSection: show pricing tiers relevant to vehicle types (can add a vehicle-type filter or expand plans)

### Remove
- Nothing removed

## Implementation Plan
1. HeroSection: Add a vehicle type selector row with 4 options (Cycle, Electric Scooter, Electric Auto, Electric Car). Use icon buttons or a radio-style pill selector. Update button label dynamically.
2. RidersSection: Add tabs for vehicle types at the top. Each tab shows a different set of fallback riders with appropriate labels. Add vehicle type badge to rider cards.
3. PricingSection: Add a vehicle type filter or add a note/badge per plan indicating which vehicle types it covers. Alternatively show a simple per-vehicle-type fare breakdown row.
