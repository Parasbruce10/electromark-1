# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from pymongo import MongoClient
# from bson.objectid import ObjectId  # <-- Add this import
# import uuid

# app = Flask(__name__)
# CORS(app)

# MONGO_URI = "mongodb+srv://paras_in_10:Bruceparas##0@cluster0.qtxbrsi.mongodb.net/?appName=Cluster0"
# client = MongoClient(MONGO_URI)
# db = client['electromark_db']
# products_collection = db['products']
# settings_collection = db['settings']

# # 1. Fetch Products
# @app.route('/api/products', methods=['GET'])
# def get_products():
#     products = []
#     for doc in products_collection.find():
#         doc['_id'] = str(doc['_id'])
#         products.append(doc)
#     return jsonify(products), 200

# # 2. Add Product
# # 2. Add Product
# @app.route('/api/products', methods=['POST'])
# def add_product():
#     data = request.json
#     new_product = {
#         "name": data.get("name"),
#         "description": data.get("description"),
#         "regularPrice": float(data.get("regularPrice", 0)),
#         "discountPrice": float(data.get("discountPrice", 0)),
#         "category": data.get("category", "Mobiles"),
#         "stockStatus": data.get("stockStatus", "in_stock"),
#         "images": data.get("images", [])
#     }
#     result = products_collection.insert_one(new_product)
#     return jsonify({"message": "Uploaded!", "id": str(result.inserted_id)}), 201

# # 3. Update Product
# @app.route('/api/products/<id>', methods=['PUT'])
# def update_product(id):
#     data = request.json
#     products_collection.update_one(
#         {"_id": ObjectId(id)},
#         {"$set": {
#             "name": data.get("name"),
#             "description": data.get("description"),
#             "regularPrice": float(data.get("regularPrice", 0)),
#             "discountPrice": float(data.get("discountPrice", 0)),
#             "category": data.get("category", "Mobiles"),
#             "stockStatus": data.get("stockStatus", "in_stock"),
#             "images": data.get("images", [])
#         }}
#     )
#     return jsonify({"message": "Updated successfully!"}), 200

# # 4. Delete Product
# @app.route('/api/products/<id>', methods=['DELETE'])
# def delete_product(id):
#     products_collection.delete_one({"_id": ObjectId(id)})
#     return jsonify({"message": "Deleted successfully!"}), 200
# # 5. Get Current Password
# @app.route('/api/get-password', methods=['GET'])
# def get_password():
#     setting = settings_collection.find_one({"type": "admin_config"})
#     if setting and "password" in setting:
#         return jsonify({"password": setting["password"]}), 200
#     # Default password agar database me entry na ho
#     return jsonify({"password": "0000"}), 200

# # 6. Update Password
# @app.route('/api/update-password', methods=['POST'])
# def update_password_api():
#     data = request.json
#     new_pass = data.get("newPassword")
#     if not new_pass:
#         return jsonify({"message": "Password is required"}), 400
        
#     settings_collection.update_one(
#         {"type": "admin_config"},
#         {"$set": {"password": new_pass}},
#         upsert=True
#     )
#     return jsonify({"message": "Password updated successfully!"}), 200
# # --- REVIEWS APIs ---

# # Add a Review
# @app.route('/api/products/<product_id>/reviews', methods=['POST'])
# def add_review(product_id):
#     data = request.json
#     new_review = {
#         "id": str(uuid.uuid4()), # Generate unique ID for review
#         "name": data.get("name"),
#         "rating": float(data.get("rating", 5)),
#         "comment": data.get("comment"),
#         "date": data.get("date")
#     }
#     products_collection.update_one(
#         {"_id": ObjectId(product_id)},
#         {"$push": {"reviews": new_review}}
#     )
#     return jsonify({"message": "Review added successfully!"}), 200

# # Delete a Review (Admin Only)
# @app.route('/api/products/<product_id>/reviews/<review_id>', methods=['DELETE'])
# def delete_review(product_id, review_id):
#     products_collection.update_one(
#         {"_id": ObjectId(product_id)},
#         {"$pull": {"reviews": {"id": review_id}}}
#     )
#     return jsonify({"message": "Review deleted successfully!"}), 200

# if __name__ == '__main__':
#     app.run(port=5000, debug=True)