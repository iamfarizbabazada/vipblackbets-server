/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: User profile management and related operations
 */

/**
 * @swagger
 * /api/profile/:
 *   get:
 *     summary: Get user profile
 *     tags: [Profile]
 *     description: Retrieve the profile information of the authenticated user.
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
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
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/profile/:
 *   put:
 *     summary: Update user profile
 *     tags: [Profile]
 *     description: Update the profile information of the authenticated user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               profile:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: Name of the user
 *                     example: Jane Doe
 *                   email:
 *                     type: string
 *                     description: Email address of the user
 *                     example: jane.doe@example.com
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/profile/orders:
 *   get:
 *     summary: Get user orders
 *     tags: [Profile]
 *     description: Retrieve all orders associated with the authenticated user.
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: Unique identifier of the order
 *                   item:
 *                     type: string
 *                     description: Name of the item ordered
 *                   quantity:
 *                     type: integer
 *                     description: Quantity of the item ordered
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/profile/change-password:
 *   patch:
 *     summary: Change user password
 *     tags: [Profile]
 *     description: Change the password for the authenticated user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 description: Current password
 *                 example: oldPassword123
 *               newPassword:
 *                 type: string
 *                 description: New password
 *                 example: newPassword123
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/profile/upload/avatar/:
 *   patch:
 *     summary: Upload user avatar
 *     tags: [Profile]
 *     description: Upload a new avatar image for the authenticated user.
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
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/profile/:
 *   delete:
 *     summary: Delete user account
 *     tags: [Profile]
 *     description: Delete the account of the authenticated user.
 *     responses:
 *       200:
 *         description: User account deleted successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/profile/notifications:
 *   post:
 *     summary: Update Expo notification token
 *     tags: [Notification]
 *     description: Updates the Expo notification token for the authenticated user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: The Expo push notification token.
 *                 example: "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]"
 *     responses:
 *       200:
 *         description: Expo notification token updated successfully
 *       400:
 *         description: Bad request - invalid token or update failed
 *       401:
 *         description: Unauthorized - user must be authenticated
 */


/**
 * @swagger
 * /api/profile/notifications:
 *   get:
 *     summary: Retrieve notifications for the authenticated user
 *     tags: [Notification]
 *     description: Fetches a list of notifications for the currently authenticated user.
 *     responses:
 *       200:
 *         description: A list of notifications for the authenticated user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: Unique identifier of the notification
 *                     example: "60d21b4667d0d8992e610c85"
 *                   receiver:
 *                     type: string
 *                     description: ID of the user who receives the notification
 *                     example: "60d21b4667d0d8992e610c84"
 *                   title:
 *                     type: string
 *                     description: Title of the notification
 *                     example: "Reminder"
 *                   body:
 *                     type: string
 *                     description: Body content of the notification
 *                     example: "Don't forget to check your tasks for today."
 *                   data:
 *                     type: object
 *                     description: Additional data related to the notification
 *                     example: { "taskId": "12345" }
 *                   status:
 *                     type: string
 *                     description: Status of the notification
 *                     example: "unread"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: Timestamp when the notification was created
 *                     example: "2024-09-14T12:34:56Z"
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     description: Timestamp when the notification was last updated
 *                     example: "2024-09-14T12:34:56Z"
 *       401:
 *         description: Unauthorized - user must be authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */



/**
 * @swagger
 * /api/profile/support:
 *   get:
 *     summary: Get list of admins
 *     tags: [Support]
 *     description: Retrieve a list of all users with the 'ADMIN' role.
 *     responses:
 *       200:
 *         description: List of admins retrieved successfully
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
 *                     example: ADMIN
 *       401:
 *         description: Unauthorized
 */
