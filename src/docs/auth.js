
/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication and OTP management
 */


/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
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
 *                     example: John Doe
 *                   email:
 *                     type: string
 *                     example: john.doe@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: User registered successfully and OTP sent
 *       400:
 *         description: Invalid input
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Unauthorized
 */


/**
 * @swagger
 * /api/auth/otp/reset:
 *   post:
 *     summary: Reset OTP
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: john.doe@example.com
 *     responses:
 *       200:
 *         description: OTP verified and user account activated
 *       400:
 *         description: Invalid OTP or OTP expired
 *       404:
 *         description: OTP token not found
 */


/**
 * @swagger
 * /api/auth/otp/verify:
 *   post:
 *     summary: Verify OTP
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               otp:
 *                 type: string
 *                 example: 1234
 *               email:
 *                 type: string
 *                 example: john.doe@example.com
 *     responses:
 *       200:
 *         description: OTP verified and user account activated
 *       400:
 *         description: Invalid OTP or OTP expired
 *       404:
 *         description: OTP token not found
 */


/**
 * @openapi
 * /api/auth/password/request:
 *   post:
 *     summary: Request a password reset
 *     tags: [Authentication]
 *     description: Sends a password reset link to the user's email if the email exists in the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Password reset email sent successfully.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Server error.
 */


/**
 * @openapi
 * /api/auth/password/reset:
 *   post:
 *     summary: Reset the user's password
 *     tags: [Authentication]
 *     description: Allows the user to reset their password using a valid otp and a new password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               otp:
 *                 type: number
 *                 example: 1234
 *               email:
 *                 type: string
 *                 example: john.doe@example.com
 *               newPassword:
 *                 type: string
 *                 minLength: 8
 *                 example: newStrongPassword123
 *     responses:
 *       200:
 *         description: Password reset successfully.
 *       400:
 *         description: Invalid or expired token.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Server error.
 */

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Log out the user
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Successfully logged out
 *       401:
 *         description: Unauthorized
 */