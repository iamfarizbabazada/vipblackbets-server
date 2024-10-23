/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management operations including CRUD and avatar upload
 */

/**
 * @swagger
 * /api/users/:
 *   get:
 *     summary: List all users
 *     tags: [Users]
 *     description: Retrieve a list of all users who are not marked as deleted.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of orders per page
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *           default: John Doe
 *         description: User name
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: Unique identifier of the user
 *                   name:
 *                     type: string
 *                     description: Name of the user
 *                   email:
 *                     type: string
 *                     description: Email address of the user
 *                   role:
 *                     type: string
 *                     description: Role of the user
 *                   isDeleted:
 *                     type: boolean
 *                     description: Indicates if the user is deleted
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     description: Retrieve a user by their unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the user
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: Unique identifier of the user
 *                 name:
 *                   type: string
 *                   description: Name of the user
 *                 email:
 *                   type: string
 *                   description: Email address of the user
 *                 role:
 *                   type: string
 *                   description: Role of the user
 *                 isDeleted:
 *                   type: boolean
 *                   description: Indicates if the user is deleted
 *       404:
 *         description: User not found or deleted
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/users/:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     description: Register a new user with the specified details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: Name of the user
 *                     example: Alice Smith
 *                   email:
 *                     type: string
 *                     description: Email address of the user
 *                     example: alice.smith@example.com
 *                   role:
 *                     type: string
 *                     description: Role of the user (ADMIN or USER)
 *                     example: USER
 *               password:
 *                 type: string
 *                 description: Password for the new user
 *                 example: securePassword123
 *     responses:
 *       200:
 *         description: User created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update a user
 *     tags: [Users]
 *     description: Update the details of an existing user by their unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: Name of the user
 *                     example: Bob Johnson
 *                   email:
 *                     type: string
 *                     description: Email address of the user
 *                     example: bob.johnson@example.com
 *               password:
 *                 type: string
 *                 description: New password for the user (optional)
 *                 example: newPassword123
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: User not found or deleted
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/users/upload/avatar/{id}:
 *   patch:
 *     summary: Upload a new avatar for a user
 *     tags: [Users]
 *     description: Upload and assign a new avatar image to the user identified by the unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the user
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Avatar image file
 *     responses:
 *       200:
 *         description: Avatar uploaded successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: User not found or deleted
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     description: Mark a user as deleted by their unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the user
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found or deleted
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/users/deleteds:
 *   get:
 *     summary: Get list of deleted users
 *     tags: [Users]
 *     description: Retrieve a paginated list of deleted users filtered by name.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of users per page
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by user name (optional)
 *     responses:
 *       200:
 *         description: A list of deleted users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                 total:
 *                   type: integer
 *                   description: Total number of deleted users
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/users/deleteds/{id}:
 *   get:
 *     summary: Get a deleted user by ID
 *     tags: [Users]
 *     description: Retrieve a specific deleted user by their unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the deleted user
 *     responses:
 *       200:
 *         description: Deleted user details
 *         content:
 *           application/json:
 *             schema:
 *              
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/users/deleteds/{id}/activate:
 *   patch:
 *     summary: Restore a deleted user
 *     tags: [Users]
 *     description: Restore a specific deleted user by their unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the deleted user
 *     responses:
 *       200:
 *         description: User restored successfully
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 */
