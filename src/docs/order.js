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


/**
 * @swagger
 * /api/deposits/:
 *   get:
 *     summary: List all deposits with pagination
 *     tags: [Deposits]
 *     description: Retrieve a paginated list of all deposits.
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
 *         description: Number of deposits per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter deposits by status
 *     responses:
 *       200:
 *         description: List of deposits with pagination details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deposits:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: Unique identifier of the deposit
 *                       status:
 *                         type: string
 *                         description: Status of the deposit
 *                       amount:
 *                         type: number
 *                         description: Total amount of the deposit
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: Creation date of the deposit
 *                 total:
 *                   type: integer
 *                   description: Total number of deposits
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/deposits/{id}:
 *   get:
 *     summary: Get a deposit by ID
 *     tags: [Deposits]
 *     description: Retrieve the details of a specific deposit by its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the deposit
 *     responses:
 *       200:
 *         description: Deposit details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: Unique identifier of the deposit
 *                 status:
 *                   type: string
 *                   description: Status of the deposit
 *                 amount:
 *                   type: number
 *                   description: Total amount of the deposit
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: Creation date of the deposit
 *       404:
 *         description: Deposit not found
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/balances/:
 *   get:
 *     summary: List all balances with pagination
 *     tags: [Balances]
 *     description: Retrieve a paginated list of all balances.
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
 *         description: Number of balances per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter balances by status
 *     responses:
 *       200:
 *         description: List of balances with pagination details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 balances:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: Unique identifier of the balance
 *                       status:
 *                         type: string
 *                         description: Status of the balance
 *                       amount:
 *                         type: number
 *                         description: Total amount of the balance
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: Creation date of the balance
 *                 total:
 *                   type: integer
 *                   description: Total number of balances
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/balances/{id}:
 *   get:
 *     summary: Get a balance by ID
 *     tags: [Balances]
 *     description: Retrieve the details of a specific balance by its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the balance
 *     responses:
 *       200:
 *         description: Balance details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: Unique identifier of the balance
 *                 status:
 *                   type: string
 *                   description: Status of the balance
 *                 amount:
 *                   type: number
 *                   description: Total amount of the balance
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: Creation date of the balance
 *       404:
 *         description: Balance not found
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/withdraws/:
 *   get:
 *     summary: List all withdraws with pagination
 *     tags: [Withdraws]
 *     description: Retrieve a paginated list of all withdraws.
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
 *         description: Number of withdraws per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter withdraws by status
 *     responses:
 *       200:
 *         description: List of withdraws with pagination details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 withdraws:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: Unique identifier of the withdraw
 *                       status:
 *                         type: string
 *                         description: Status of the withdraw
 *                       amount:
 *                         type: number
 *                         description: Total amount of the withdraw
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: Creation date of the withdraw
 *                 total:
 *                   type: integer
 *                   description: Total number of withdraws
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/withdraws/{id}:
 *   get:
 *     summary: Get a withdraw by ID
 *     tags: [Withdraws]
 *     description: Retrieve the details of a specific withdraw by its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the withdraw
 *     responses:
 *       200:
 *         description: Withdraw details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: Unique identifier of the withdraw
 *                 status:
 *                   type: string
 *                   description: Status of the withdraw
 *                 amount:
 *                   type: number
 *                   description: Total amount of the withdraw
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: Creation date of the withdraw
 *       404:
 *         description: Withdraw not found
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/balances/{id}/complete:
 *   patch:
 *     summary: Complete a balance
 *     tags: [Balances]
 *     description: Mark a balance as completed and send a notification to the user.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the balance
 *     responses:
 *       200:
 *         description: Balance marked as completed
 *       400:
 *         description: Balance is already completed
 *       404:
 *         description: Balance not found
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/balances/{id}/reject:
 *   patch:
 *     summary: Reject a balance
 *     tags: [Balances]
 *     description: Mark a balance as rejected and send a notification to the user.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the balance
 *     responses:
 *       200:
 *         description: Balance marked as rejected
 *       400:
 *         description: Balance is already rejected
 *       404:
 *         description: Balance not found
 *       401:
 *         description: Unauthorized
 */


/**
 * @swagger
 * /api/withdraws/{id}/complete:
 *   patch:
 *     summary: Complete a withdraw
 *     tags: [Withdraws]
 *     description: Mark a withdraw as completed and send a notification to the user.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the withdraw
 *     responses:
 *       200:
 *         description: Withdraw marked as completed
 *       400:
 *         description: Withdraw is already completed or has a residual balance
 *       404:
 *         description: Withdraw not found
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/withdraws/{id}/pay:
 *   patch:
 *     summary: Pay a withdraw
 *     tags: [Withdraws]
 *     description: Pay an amount for the withdraw and send a notification to the user.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the withdraw
 *       - in: body
 *         name: amount
 *         schema:
 *           type: number
 *         description: The amount to be paid for the withdraw
 *     responses:
 *       200:
 *         description: Withdraw marked as paid
 *       404:
 *         description: Withdraw not found
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/withdraws/{id}/reject:
 *   patch:
 *     summary: Reject a withdraw
 *     tags: [Withdraws]
 *     description: Mark a withdraw as rejected and send a notification to the user.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the withdraw
 *     responses:
 *       200:
 *         description: Withdraw marked as rejected
 *       400:
 *         description: Withdraw is already rejected
 *       404:
 *         description: Withdraw not found
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/deposits/{id}/complete:
 *   patch:
 *     summary: Complete a deposit
 *     tags: [Deposits]
 *     description: Mark a deposit as completed, decrease the user's balance, and send a notification.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the deposit
 *       - in: body
 *         name: amount
 *         schema:
 *           type: number
 *         description: The amount to be deducted from the user's balance (optional)
 *     responses:
 *       200:
 *         description: Deposit marked as completed and balance updated
 *       400:
 *         description: Deposit is already completed
 *       404:
 *         description: Deposit not found
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/deposits/{id}/reject:
 *   patch:
 *     summary: Reject a deposit
 *     tags: [Deposits]
 *     description: Mark a deposit as rejected and send a notification to the user.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the deposit
 *     responses:
 *       200:
 *         description: Deposit marked as rejected
 *       400:
 *         description: Deposit is already rejected
 *       404:
 *         description: Deposit not found
 *       401:
 *         description: Unauthorized
 */
