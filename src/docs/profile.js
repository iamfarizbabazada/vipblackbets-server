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
