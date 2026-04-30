# TODO: Add Push Notification Enable Button in Profile Dropdown

## Task
Move the push notification enable button inside the profile dropdown menu alongside "Main Services", "History", and "Logout" options.

## Steps Completed:
- [x] Analyze codebase and understand current implementation
- [x] Create implementation plan
- [x] Get user confirmation

## Steps to Implement:
- [ ] Modify `src/components/dashboard/DashboardAppbar.vue`:
  - [ ] Add notification toggle inside desktop dropdown (v-menu)
  - [ ] Add notification toggle inside mobile dropdown
  - [ ] Add disable notifications functionality
  - [ ] Refactor to remove duplicate button outside dropdown
  
## Testing:
- [ ] Test notification enable from dropdown
- [ ] Test notification disable from dropdown
- [ ] Verify mobile responsiveness
