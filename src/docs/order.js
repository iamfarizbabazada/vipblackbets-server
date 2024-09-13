/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Operations for managing orders
 */

/**
 * @swagger
 * /api/orders/:
 *   get:
 *     summary: List all orders with pagination
 *     tags: [Orders]
 *     description: Retrieve a paginated list of all orders.
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
 *     responses:
 *       200:
 *         description: List of orders with pagination details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orders:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: Unique identifier of the order
 *                       status:
 *                         type: string
 *                         description: Status of the order
 *                       amount:
 *                         type: number
 *                         description: Total amount of the order
 *                       paymentType:
 *                         type: string
 *                         description: Payment method used
 *                       provider:
 *                         type: string
 *                         description: Provider of the payment
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: Creation date of the order
 *                 total:
 *                   type: integer
 *                   description: Total number of orders
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get an order by ID
 *     tags: [Orders]
 *     description: Retrieve the details of a specific order by its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the order
 *     responses:
 *       200:
 *         description: Order details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: Unique identifier of the order
 *                 status:
 *                   type: string
 *                   description: Status of the order
 *                 amount:
 *                   type: number
 *                   description: Total amount of the order
 *                 paymentType:
 *                   type: string
 *                   description: Payment method used
 *                 provider:
 *                   type: string
 *                   description: Provider of the payment
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: Creation date of the order
 *       404:
 *         description: Order not found
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/orders/:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     description: Place a new order for the authenticated user.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File related to the order
 *               amount:
 *                 type: number
 *                 description: Total amount of the order
 *                 example: 100.00
 *               paymentType:
 *                 type: string
 *                 description: Payment method used
 *                 enum:
 *                   - CREDIT_CARD
 *                   - DEBIT_CARD
 *                   - PAYPAL
 *                   - BANK_TRANSFER
 *                 example: CREDIT_CARD
 *               provider:
 *                 type: string
 *                 description: Provider of the payment
 *                 enum:
 *                   - VISA
 *                   - MASTERCARD
 *                   - AMEX
 *                   - PAYPAL
 *                   - STRIPE
 *                 example: VISA
 *     responses:
 *       200:
 *         description: Order created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */


/**
 * @swagger
 * /api/orders/{id}:
 *   put:
 *     summary: Update an order
 *     tags: [Orders]
 *     description: Update the details of an existing order by its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               order:
 *                 type: object
 *                 properties:
 *                   amount:
 *                     type: number
 *                     description: Total amount of the order
 *                     example: 120.00
 *                   paymentType:
 *                     type: string
 *                     description: Payment method used
 *                     enum:
 *                       - CREDIT_CARD
 *                       - DEBIT_CARD
 *                       - PAYPAL
 *                       - BANK_TRANSFER
 *                     example: PAYPAL
 *                   provider:
 *                     type: string
 *                     description: Provider of the payment
 *                     enum:
 *                       - VISA
 *                       - MASTERCARD
 *                       - AMEX
 *                       - PAYPAL
 *                       - STRIPE
 *                     example: STRIPE
 *     responses:
 *       200:
 *         description: Order updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Order not found
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/orders/{id}/complete:
 *   patch:
 *     summary: Mark an order as completed
 *     tags: [Orders]
 *     description: Change the status of an order to "COMPLETED".
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the order
 *     responses:
 *       200:
 *         description: Order status updated to completed
 *       400:
 *         description: Order is already completed
 *       404:
 *         description: Order not found
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/orders/{id}/reject:
 *   patch:
 *     summary: Mark an order as rejected
 *     tags: [Orders]
 *     description: Change the status of an order to "REJECTED".
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the order
 *     responses:
 *       200:
 *         description: Order status updated to rejected
 *       400:
 *         description: Order is already rejected
 *       404:
 *         description: Order not found
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/orders/{id}:
 *   delete:
 *     summary: Delete an order
 *     tags: [Orders]
 *     description: Mark an order as deleted by its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the order
 *     responses:
 *       200:
 *         description: Order marked as deleted
 *       404:
 *         description: Order not found
 *       401:
 *         description: Unauthorized
 */
