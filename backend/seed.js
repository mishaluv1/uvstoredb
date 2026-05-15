import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Product from './models/Product.js'
import User from './models/User.js'

dotenv.config()

const products = [
    { name: "Women Round Neck Cotton Top", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 100, image: ["/src/assets/p_img1.png"], category: "Women", subCategory: "Topwear", sizes: ["S", "M", "L"], bestseller: true, stock: 100 },
    { name: "Men Round Neck Pure Cotton T-shirt", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 200, image: ["/src/assets/p_img2_1.png", "/src/assets/p_img2_2.png", "/src/assets/p_img2_3.png", "/src/assets/p_img2_4.png"], category: "Men", subCategory: "Topwear", sizes: ["M", "L", "XL"], bestseller: true, stock: 100 },
    { name: "Girls Round Neck Cotton Top", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 220, image: ["/src/assets/p_img3.png"], category: "Kids", subCategory: "Topwear", sizes: ["S", "L", "XL"], bestseller: true, stock: 100 },
    { name: "Men Round Neck Pure Cotton T-shirt", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 110, image: ["/src/assets/p_img4.png"], category: "Men", subCategory: "Topwear", sizes: ["S", "M", "XXL"], bestseller: true, stock: 100 },
    { name: "Women Round Neck Cotton Top", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 130, image: ["/src/assets/p_img5.png"], category: "Women", subCategory: "Topwear", sizes: ["M", "L", "XL"], bestseller: true, stock: 100 },
    { name: "Girls Round Neck Cotton Top", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 140, image: ["/src/assets/p_img6.png"], category: "Kids", subCategory: "Topwear", sizes: ["S", "L", "XL"], bestseller: true, stock: 100 },
    { name: "Men Tapered Fit Flat-Front Trousers", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 190, image: ["/src/assets/p_img7.png"], category: "Men", subCategory: "Bottomwear", sizes: ["S", "L", "XL"], bestseller: false, stock: 100 },
    { name: "Men Round Neck Pure Cotton T-shirt", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 140, image: ["/src/assets/p_img8.png"], category: "Men", subCategory: "Topwear", sizes: ["S", "M", "L", "XL"], bestseller: false, stock: 100 },
    { name: "Girls Round Neck Cotton Top", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 100, image: ["/src/assets/p_img9.png"], category: "Kids", subCategory: "Topwear", sizes: ["M", "L", "XL"], bestseller: false, stock: 100 },
    { name: "Men Tapered Fit Flat-Front Trousers", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 110, image: ["/src/assets/p_img10.png"], category: "Men", subCategory: "Bottomwear", sizes: ["S", "L", "XL"], bestseller: false, stock: 100 },
    { name: "Men Round Neck Pure Cotton T-shirt", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 120, image: ["/src/assets/p_img11.png"], category: "Men", subCategory: "Topwear", sizes: ["S", "M", "L"], bestseller: false, stock: 100 },
    { name: "Men Round Neck Pure Cotton T-shirt", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 150, image: ["/src/assets/p_img12.png"], category: "Men", subCategory: "Topwear", sizes: ["S", "M", "L", "XL"], bestseller: false, stock: 100 },
    { name: "Women Round Neck Cotton Top", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 130, image: ["/src/assets/p_img13.png"], category: "Women", subCategory: "Topwear", sizes: ["S", "M", "L", "XL"], bestseller: false, stock: 100 },
    { name: "Boy Round Neck Pure Cotton T-shirt", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 160, image: ["/src/assets/p_img14.png"], category: "Kids", subCategory: "Topwear", sizes: ["S", "M", "L", "XL"], bestseller: false, stock: 100 },
    { name: "Men Tapered Fit Flat-Front Trousers", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 140, image: ["/src/assets/p_img15.png"], category: "Men", subCategory: "Bottomwear", sizes: ["S", "M", "L", "XL"], bestseller: false, stock: 100 },
    { name: "Girls Round Neck Cotton Top", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 170, image: ["/src/assets/p_img16.png"], category: "Kids", subCategory: "Topwear", sizes: ["S", "M", "L", "XL"], bestseller: false, stock: 100 },
    { name: "Men Tapered Fit Flat-Front Trousers", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 150, image: ["/src/assets/p_img17.png"], category: "Men", subCategory: "Bottomwear", sizes: ["S", "M", "L", "XL"], bestseller: false, stock: 100 },
    { name: "Boy Round Neck Pure Cotton T-shirt", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 180, image: ["/src/assets/p_img18.png"], category: "Kids", subCategory: "Topwear", sizes: ["S", "M", "L", "XL"], bestseller: false, stock: 100 },
    { name: "Boy Round Neck Pure Cotton T-shirt", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 160, image: ["/src/assets/p_img19.png"], category: "Kids", subCategory: "Topwear", sizes: ["S", "M", "L", "XL"], bestseller: false, stock: 100 },
    { name: "Women Palazzo Pants with Waist Belt", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 190, image: ["/src/assets/p_img20.png"], category: "Women", subCategory: "Bottomwear", sizes: ["S", "M", "L", "XL"], bestseller: false, stock: 100 },
    { name: "Women Zip-Front Relaxed Fit Jacket", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 170, image: ["/src/assets/p_img21.png"], category: "Women", subCategory: "Winterwear", sizes: ["S", "M", "L", "XL"], bestseller: false, stock: 100 },
    { name: "Women Palazzo Pants with Waist Belt", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 200, image: ["/src/assets/p_img22.png"], category: "Women", subCategory: "Bottomwear", sizes: ["S", "M", "L", "XL"], bestseller: false, stock: 100 },
    { name: "Boy Round Neck Pure Cotton T-shirt", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 180, image: ["/src/assets/p_img23.png"], category: "Kids", subCategory: "Topwear", sizes: ["S", "M", "L", "XL"], bestseller: false, stock: 100 },
    { name: "Boy Round Neck Pure Cotton T-shirt", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 210, image: ["/src/assets/p_img24.png"], category: "Kids", subCategory: "Topwear", sizes: ["S", "M", "L", "XL"], bestseller: false, stock: 100 },
    { name: "Girls Round Neck Cotton Top", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 190, image: ["/src/assets/p_img25.png"], category: "Kids", subCategory: "Topwear", sizes: ["S", "M", "L", "XL"], bestseller: false, stock: 100 },
    { name: "Women Zip-Front Relaxed Fit Jacket", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 220, image: ["/src/assets/p_img26.png"], category: "Women", subCategory: "Winterwear", sizes: ["S", "M", "L", "XL"], bestseller: false, stock: 100 },
    { name: "Girls Round Neck Cotton Top", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 200, image: ["/src/assets/p_img27.png"], category: "Kids", subCategory: "Topwear", sizes: ["S", "M", "L", "XL"], bestseller: false, stock: 100 },
    { name: "Men Slim Fit Relaxed Denim Jacket", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 230, image: ["/src/assets/p_img28.png"], category: "Men", subCategory: "Winterwear", sizes: ["S", "M", "L", "XL"], bestseller: false, stock: 100 },
    { name: "Women Round Neck Cotton Top", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 210, image: ["/src/assets/p_img29.png"], category: "Women", subCategory: "Topwear", sizes: ["S", "M", "L", "XL"], bestseller: false, stock: 100 },
    { name: "Girls Round Neck Cotton Top", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 240, image: ["/src/assets/p_img30.png"], category: "Kids", subCategory: "Topwear", sizes: ["S", "M", "L", "XL"], bestseller: false, stock: 100 },
    { name: "Men Round Neck Pure Cotton T-shirt", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 220, image: ["/src/assets/p_img31.png"], category: "Men", subCategory: "Topwear", sizes: ["S", "M", "L", "XL"], bestseller: false, stock: 100 },
    { name: "Men Round Neck Pure Cotton T-shirt", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 250, image: ["/src/assets/p_img32.png"], category: "Men", subCategory: "Topwear", sizes: ["S", "M", "L", "XL"], bestseller: false, stock: 100 },
    { name: "Girls Round Neck Cotton Top", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 230, image: ["/src/assets/p_img33.png"], category: "Kids", subCategory: "Topwear", sizes: ["S", "M", "L", "XL"], bestseller: false, stock: 100 },
    { name: "Women Round Neck Cotton Top", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 260, image: ["/src/assets/p_img34.png"], category: "Women", subCategory: "Topwear", sizes: ["S", "M", "L", "XL"], bestseller: false, stock: 100 },
    { name: "Women Zip-Front Relaxed Fit Jacket", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 240, image: ["/src/assets/p_img35.png"], category: "Women", subCategory: "Winterwear", sizes: ["S", "M", "L", "XL"], bestseller: false, stock: 100 },
    { name: "Women Zip-Front Relaxed Fit Jacket", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 270, image: ["/src/assets/p_img36.png"], category: "Women", subCategory: "Winterwear", sizes: ["S", "M", "L", "XL"], bestseller: false, stock: 100 },
    { name: "Women Round Neck Cotton Top", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 250, image: ["/src/assets/p_img37.png"], category: "Women", subCategory: "Topwear", sizes: ["S", "M", "L", "XL"], bestseller: false, stock: 100 },
    { name: "Men Round Neck Pure Cotton T-shirt", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 280, image: ["/src/assets/p_img38.png"], category: "Men", subCategory: "Topwear", sizes: ["S", "M", "L", "XL"], bestseller: false, stock: 100 },
    { name: "Men Printed Plain Cotton Shirt", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 260, image: ["/src/assets/p_img39.png"], category: "Men", subCategory: "Topwear", sizes: ["S", "M", "L", "XL"], bestseller: false, stock: 100 },
    { name: "Men Slim Fit Relaxed Denim Jacket", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 290, image: ["/src/assets/p_img40.png"], category: "Men", subCategory: "Winterwear", sizes: ["S", "M", "L", "XL"], bestseller: false, stock: 100 },
    { name: "Men Round Neck Pure Cotton T-shirt", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 270, image: ["/src/assets/p_img41.png"], category: "Men", subCategory: "Topwear", sizes: ["S", "M", "L", "XL"], bestseller: false, stock: 100 },
    { name: "Boy Round Neck Pure Cotton T-shirt", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 300, image: ["/src/assets/p_img42.png"], category: "Kids", subCategory: "Topwear", sizes: ["S", "M", "L", "XL"], bestseller: false, stock: 100 },
    { name: "Kid Tapered Slim Fit Trouser", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 280, image: ["/src/assets/p_img43.png"], category: "Kids", subCategory: "Bottomwear", sizes: ["S", "M", "L", "XL"], bestseller: false, stock: 100 },
    { name: "Women Zip-Front Relaxed Fit Jacket", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 310, image: ["/src/assets/p_img44.png"], category: "Women", subCategory: "Winterwear", sizes: ["S", "M", "L", "XL"], bestseller: false, stock: 100 },
    { name: "Men Slim Fit Relaxed Denim Jacket", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 290, image: ["/src/assets/p_img45.png"], category: "Men", subCategory: "Winterwear", sizes: ["S", "M", "L", "XL"], bestseller: false, stock: 100 },
    { name: "Men Slim Fit Relaxed Denim Jacket", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 320, image: ["/src/assets/p_img46.png"], category: "Men", subCategory: "Winterwear", sizes: ["S", "M", "L", "XL"], bestseller: false, stock: 100 },
    { name: "Kid Tapered Slim Fit Trouser", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 300, image: ["/src/assets/p_img47.png"], category: "Kids", subCategory: "Bottomwear", sizes: ["S", "M", "L", "XL"], bestseller: false, stock: 100 },
    { name: "Men Slim Fit Relaxed Denim Jacket", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 330, image: ["/src/assets/p_img48.png"], category: "Men", subCategory: "Winterwear", sizes: ["S", "M", "L", "XL"], bestseller: false, stock: 100 },
    { name: "Kid Tapered Slim Fit Trouser", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 310, image: ["/src/assets/p_img49.png"], category: "Kids", subCategory: "Bottomwear", sizes: ["S", "M", "L", "XL"], bestseller: false, stock: 100 },
    { name: "Kid Tapered Slim Fit Trouser", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 340, image: ["/src/assets/p_img50.png"], category: "Kids", subCategory: "Bottomwear", sizes: ["S", "M", "L", "XL"], bestseller: false, stock: 100 },
    { name: "Women Zip-Front Relaxed Fit Jacket", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 320, image: ["/src/assets/p_img51.png"], category: "Women", subCategory: "Winterwear", sizes: ["S", "M", "L", "XL"], bestseller: false, stock: 100 },
    { name: "Men Slim Fit Relaxed Denim Jacket", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 350, image: ["/src/assets/p_img52.png"], category: "Men", subCategory: "Winterwear", sizes: ["S", "M", "L", "XL"], bestseller: false, stock: 100 }
]

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Connected to MongoDB')

        // Clear existing data
        await Product.deleteMany({})
        await User.deleteMany({})
        console.log('Cleared existing data')

        // Insert products
        await Product.insertMany(products)
        console.log(`Inserted ${products.length} products`)

        // Create admin user
        const admin = await User.create({
            name: 'Admin',
            email: 'admin@uvstore.com',
            password: 'admin123',
            role: 'admin'
        })
        console.log(`Admin user created: ${admin.email} (password: admin123)`)

        // Create a test user
        const user = await User.create({
            name: 'Test User',
            email: 'user@uvstore.com',
            password: 'user123',
            role: 'user'
        })
        console.log(`Test user created: ${user.email} (password: user123)`)

        console.log('Database seeded successfully!')
        process.exit(0)
    } catch (error) {
        console.error('Seed error:', error)
        process.exit(1)
    }
}

seedDB()