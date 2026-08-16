# Seeded Demo Users

This application automatically creates demo users on startup for testing and development purposes. These users are created in `SportsHubApplication.java` during the `CommandLineRunner` initialization.

## Demo Accounts

The following usernames and emails are **reserved** and cannot be used for new registrations:

| Username | Email | Password | Role |
|----------|-------|----------|------|
| admin | admin@vav.com | admin123 | ROLE_ADMIN |
| coach | coach@vav.com | coach123 | ROLE_COACH |
| student | student@vav.com | student123 | ROLE_STUDENT |
| student2 | student2@vav.com | student123 | ROLE_STUDENT |
| Isuru | isuru@gmail.com | password | ROLE_STUDENT |
| admin1 | admin@test.com | password | ROLE_ADMIN |

## For Developers

When testing new user registration:
- **Avoid** using any of the usernames or emails listed above
- Use unique usernames like: `testuser1`, `vicecaptain1`, `captain1`, etc.
- Use unique emails like: `test1@example.com`, `vc1@test.com`, etc.

## For End Users

If you see the error "Username is already taken!" or "Email is already in use!", please choose a different username or email address.

## Registering Different Roles

The application supports the following roles:
- **ROLE_STUDENT** - Default role for students
- **ROLE_CAPTAIN** - Team captains
- **ROLE_VICE_CAPTAIN** - Vice captains (assistant to captains)
- **ROLE_COACH** - Coaches
- **ROLE_ADMIN** - System administrators

All roles can be selected during registration. There are no restrictions on registering as a Vice Captain - simply select "Vice Captain" from the role dropdown during registration.
