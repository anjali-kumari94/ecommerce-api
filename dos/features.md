E commerce API using mongoose and express. Features

FEATURES
Product Features

1. Product catalog: Retrieve a list of all products with filtering, sorting, and pagination options.Products Details: View detailed information about a specific product (description, price, images, stock, etc.). Product brand, category, or other attributes.Stock management: Update product quantity automatically after purchase.Related Products: Display products that are similar or often bought together.

2. Category Features
   Category Listing: List all product categories for easy browsing.Category Filtering:Filter products by category management (Admin): Add, update, and delete categories as needed.

3. Brand Features
   Brand Listing: Show available brands for filtering purposes.Brand Filtering: Allow users to filter products by brand.Brand Management (Admin): Add, update, and remove brands for product association.

4. Coupon Features
   Coupon application: Apply a coupon code at checkout to receive a discount.Coupon Validation: Validate the coupon's expiration date and conditions (e.g, minimum order amount).Coupon Management (Admin): Create, update, and deactivate coupons.Discount calculation: Calculate and apply the discount from a valid to the order total.

5. Payment Features
   Payment Processing: Integrate with payment gateways (e.g.,Stripe, PayPal ) to handle payments securely.Payments status: Track whether the payment is pending, completed, or failed.Refund Processing: Allow admins to issue refunds for orders, if necessary.Payment History: Record each payment transaction associated with orders for user and admin reference.

6. Review Features
   Product Reviews: Allow customers to leave a review for purchased products.Ratings: Enable a rating system (e.g., 1-5 stars) alongside textual reviews. REview moderation (Admin): Approve, edit, or delete reviews to maintain quality.Aggregate Ratings: Show the average rating for each product based on user reviews.

7. Orders Features
   Order Placement: Allow users to place an order by adding products to the cart and proceeding with payment.Order Status Tracking: Update and display the status of each order (e.g., pending, confirmed, shipped, delivered). Order History: Display past orders for users to view details. Order Details: Include product details, shipping info, payment status, and total amount in each order.

Cart Features
Add to Cart: Allow users to add products to their cart with specified quantities. View Cart: Retrieve a list of all items in the cart, including the total cost. Update Cart: Modify quantities or remove items from the cart.Calculate Cart Total: Dynamically update the cart's total price based on items and quantities.Persistent Cart:Save cart items for logged-in users, even if they logout and return later.

9. Wishlist Features
   Add to Wishlist: Allow users to save products for later in their wishlist.View Wishlist:Retrieve all items saved in a user's wishlist.Remove from Wishlist: Allow users to delete items from their wishlist.Add from Wishlist to Cart: Simplify the process of moving items from the wishlist to the cart.

10. User Features
    User Registration & Login: Create an account or log in with secure authentication.User Profile: Update Personal information like name, email, password, address, and phone.Address Book: Manage multiple addresses for different shipping locations.Password Reset: Allow users to reset their password if forgotten.User Role Management (Admin): Designate different roles, such as customers and admins, with distinct permissions.

11. Shipping Method Features
    Shipping Options: offer different shipping methods like Express and Standard shipping. Shipping Cost Calculation: Calculate costs based on the chosen shipping method, distance, or order weight.Shipping Time Estimates: Provide estimated delivery dates for each shipping option.Shipping Method Selection at Checkout: Let users choose their preferred shipping method at checkout.Shipping Management(Admin): Set up and manage shipping methods, rates, and regions.
