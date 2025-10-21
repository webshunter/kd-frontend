import React, { useState, useEffect, useMemo } from 'react';
import SectionTitle from '../components/SectionTitle';
import { useAuth } from '../contexts/AuthContext';
import { View } from '../types';
import { productService } from '../src/services/productService';

// --- TYPES ---
interface Product {
    id: string; // Product ID from database
    name: string;
    price: number;
    compare_at_price?: number; // Original price untuk sale
    image_url?: string; // URL gambar dari database
    image?: string; // Fallback untuk demo products
    seller?: string; // Business name dari UMKM
    umkm_name?: string; // Business name dari join query
    is_featured?: boolean;
    isOnSale?: boolean; // Computed dari compare_at_price
    isFeatured?: boolean; // Computed dari is_featured
}

interface CartItem extends Product {
    id: string;
    quantity: number;
}

// --- UTILITY FUNCTIONS ---
const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(price);
};

// --- CHILD COMPONENTS ---
const ProductCard: React.FC<{ product: Product; onAddToCart: (product: Product) => void, isPromo?: boolean }> = ({ product, onAddToCart, isPromo = false }) => {
    // Get image URL, prioritize image_url dari database
    const imageUrl = product.image_url || product.image || 'https://picsum.photos/400/400?random=' + Math.random();
    
    return (
        <div className={`bg-white rounded-lg shadow-md overflow-hidden group border h-full flex flex-col ${isPromo ? 'w-64 sm:w-72 flex-shrink-0' : ''}`}>
            <div className="overflow-hidden relative">
                <img 
                    src={imageUrl.startsWith('/') ? `${window.location.protocol}//${window.location.host}${imageUrl}` : imageUrl} 
                    alt={product.name} 
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                        // Fallback to placeholder if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://picsum.photos/400/400?random=' + Math.random();
                    }}
                />
                {product.isOnSale && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md z-10">
                        OBRAL
                    </div>
                )}
                {product.isFeatured && (
                     <div className="absolute top-2 right-2 bg-yellow-400 text-gray-900 text-xs font-bold px-2 py-1 rounded-full shadow-md z-10 flex items-center">
                        <span className="material-symbols-outlined !text-sm mr-1">star</span>
                        UNGGULAN
                    </div>
                )}
            </div>
            <div className="p-4 flex-grow flex flex-col">
                <h3 className="text-md font-semibold text-gray-800 truncate flex-grow h-12">{product.name}</h3>
                <p className="text-sm text-gray-500">{product.seller}</p>
                <div className="mt-2">
                    {product.isOnSale && product.compare_at_price ? (
                        <div className="flex items-baseline space-x-2">
                            <p className="text-lg font-bold text-red-600">{formatPrice(product.price)}</p>
                            <p className="text-sm text-gray-500 line-through">{formatPrice(product.compare_at_price)}</p>
                        </div>
                    ) : (
                        <p className="text-lg font-bold text-orange-600">{formatPrice(product.price)}</p>
                    )}
                </div>
                <button 
                    onClick={() => onAddToCart(product)}
                    className="w-full mt-4 bg-orange-500 text-white font-bold py-2 px-4 rounded-full hover:bg-orange-600 transition duration-300 flex items-center justify-center space-x-2"
                >
                    <span className="material-symbols-outlined">add_shopping_cart</span>
                    <span>Keranjang</span>
                </button>
            </div>
        </div>
    );
};

const CartSidebar: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    cartItems: CartItem[];
    onUpdateQuantity: (id: string, newQuantity: number) => void;
    onRemove: (id: string) => void;
    onCheckout: () => void;
}> = ({ isOpen, onClose, cartItems, onUpdateQuantity, onRemove, onCheckout }) => {
    const total = useMemo(() => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0), [cartItems]);
    
    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity" onClick={onClose}></div>
            <div className={`fixed top-0 right-0 w-full max-w-md h-full bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold text-gray-800">Keranjang Belanja</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                {cartItems.length === 0 ? (
                    <div className="flex-grow flex flex-col justify-center items-center text-center p-4">
                        <span className="material-symbols-outlined text-6xl text-gray-300">shopping_cart_off</span>
                        <p className="mt-4 font-semibold text-gray-700">Keranjang Anda kosong</p>
                        <p className="text-sm text-gray-500">Ayo mulai belanja produk UMKM lokal!</p>
                    </div>
                ) : (
                    <div className="flex-grow overflow-y-auto p-4 space-y-4">
                        {cartItems.map(item => (
                            <div key={item.id} className="flex items-center space-x-4 border-b pb-4">
                                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                                <div className="flex-grow">
                                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                                    <p className="text-sm text-gray-500">{formatPrice(item.price)}</p>
                                    <div className="flex items-center mt-2">
                                        <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="text-gray-500 border rounded-full w-6 h-6 flex items-center justify-center">-</button>
                                        <span className="px-3 font-semibold">{item.quantity}</span>
                                        <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="text-gray-500 border rounded-full w-6 h-6 flex items-center justify-center">+</button>
                                    </div>
                                </div>
                                <button onClick={() => onRemove(item.id)} className="text-red-500 hover:text-red-700">
                                    <span className="material-symbols-outlined">delete</span>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                {cartItems.length > 0 && (
                    <div className="p-4 border-t">
                        <div className="flex justify-between items-center font-bold text-lg mb-4">
                            <span>Total</span>
                            <span>{formatPrice(total)}</span>
                        </div>
                        <button 
                            onClick={onCheckout}
                            className="w-full bg-green-500 text-white font-bold py-3 px-4 rounded-full hover:bg-green-600 transition-colors"
                        >
                            Lanjut ke Checkout
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

// --- MAIN COMPONENT ---
const TangselMart: React.FC = () => {
    const { user, role } = useAuth();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load cart from localStorage on initial render
    useEffect(() => {
        const savedCart = localStorage.getItem('tangselmart-cart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, []);

    // Load products from database
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const response = await productService.getAllProducts({ 
                    limit: 50 // Ambil semua produk
                });
                
                // Transform database products to match interface
                const transformedProducts = response.data.map((product: any) => ({
                    id: product.id,
                    name: product.name,
                    price: parseFloat(product.price),
                    compare_at_price: product.compare_at_price ? parseFloat(product.compare_at_price) : undefined,
                    image: product.image_url || 'https://picsum.photos/400/400?random=' + Math.random(),
                    seller: product.umkm_name || product.seller || 'UMKM Tangsel',
                    isFeatured: product.is_featured,
                    isOnSale: product.compare_at_price && parseFloat(product.compare_at_price) > parseFloat(product.price)
                }));
                
                setProducts(transformedProducts);
            } catch (err) {
                console.error('Error loading products:', err);
                setError('Gagal memuat produk dari database');
                // Fallback ke demo products jika ada error
                loadDemoProducts();
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Fallback function untuk demo products
    const loadDemoProducts = () => {
        const demoProducts: Product[] = [
            { id: "demo-prod-001", name: "Madu Hutan Asli", price: 120000, image: "https://picsum.photos/400/400?random=9", seller: "Toko Madu Lestari", isFeatured: true },
            { id: "demo-prod-002", name: "Kain Batik Tulis Motif Anggrek", price: 315000, compare_at_price: 350000, image: "https://picsum.photos/400/400?random=10", seller: "Batik Tangsel Asli", isOnSale: true, isFeatured: true },
            { id: "demo-prod-003", name: "Keripik Singkong Balado Premium", price: 25000, image: "https://picsum.photos/400/400?random=11", seller: "Dapur Ibu Ani" },
            { id: "demo-prod-004", name: "Tas Kulit Buatan Tangan", price: 425000, compare_at_price: 450000, image: "https://picsum.photos/400/400?random=12", seller: "Leather Craft Tangsel", isOnSale: true },
            { id: "demo-prod-005", name: "Paket Biji Kopi Robusta", price: 85000, image: "https://picsum.photos/400/400?random=13", seller: "Kopi Kenangan Senja" },
            { id: "demo-prod-006", name: "Lukisan Abstrak 'Harapan'", price: 1500000, image: "https://picsum.photos/400/400?random=14", seller: "Galeri Seni Lokal" },
            { id: "demo-prod-007", name: "Sabun Herbal Organik", price: 35000, image: "https://picsum.photos/400/400?random=15", seller: "Alam Sehat" },
            { id: "demo-prod-008", name: "Mainan Edukasi Kayu", price: 150000, image: "https://picsum.photos/400/400?random=16", seller: "Kreasi Anak Bangsa", isFeatured: true },
        ];
        setProducts(demoProducts);
    };

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        if(cart.length > 0) {
          localStorage.setItem('tangselmart-cart', JSON.stringify(cart));
        } else {
          localStorage.removeItem('tangselmart-cart');
        }
    }, [cart]);
    
    // Handle checkout - Save cart to sessionStorage and redirect to dashboard checkout
    const handleCheckout = () => {
        // Check if user is logged in
        if (!user) {
            // Save cart and redirect to login
            sessionStorage.setItem('cart', JSON.stringify(cart));
            sessionStorage.setItem('kd-current-view', View.Login);
            sessionStorage.setItem('kd-redirect-after-login', 'checkout');
            window.location.reload();
            return;
        }
        
        // Check if user is customer
        if (role !== 'customer') {
            alert('Hanya customer yang dapat melakukan checkout. Silakan login dengan akun customer.');
            return;
        }
        
        // Save cart to sessionStorage for checkout page
        sessionStorage.setItem('cart', JSON.stringify(cart));
        
        // Redirect to Dashboard Checkout
        sessionStorage.setItem('kd-current-view', View.UMKMDashboard);
        sessionStorage.setItem('kd-dashboard-view', 'Checkout');
        window.location.reload();
    };
    
    const handleAddToCart = (product: Product) => {
        setCart(prevCart => {
            // Use product.id if available, otherwise use product name as fallback
            const productId = product.id || `demo-${product.name.toLowerCase().replace(/\s+/g, '-')}`;
            const existingItem = prevCart.find(item => item.id === productId);
            
            if (existingItem) {
                return prevCart.map(item =>
                    item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                return [...prevCart, { 
                    ...product, 
                    id: productId,
                    quantity: 1 
                }];
            }
        });
        setIsCartOpen(true);
    };

    const handleUpdateQuantity = (id: string, newQuantity: number) => {
        if (newQuantity < 1) {
            handleRemoveFromCart(id);
        } else {
            setCart(cart.map(item => item.id === id ? { ...item, quantity: newQuantity } : item));
        }
    };

    const handleRemoveFromCart = (id: string) => {
        setCart(cart.filter(item => item.id !== id));
    };

    const cartItemCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

    // Filter products untuk tampilan
    const saleProducts = useMemo(() => products.filter(p => p.isOnSale), [products]);
    const featuredProducts = useMemo(() => products.filter(p => p.isFeatured), [products]);
    
  return (
    <div className="container mx-auto px-6 py-12">
      <SectionTitle 
        title="Selamat Datang di TangselMart"
        subtitle="Jelajahi dan beli produk-produk unggulan hasil karya UMKM Tangerang Selatan."
      />

        {/* Loading State */}
        {loading && (
            <div className="flex justify-center items-center py-16">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                    <p className="text-gray-600">Memuat produk UMKM...</p>
                </div>
            </div>
        )}

        {/* Error State */}
        {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <div className="text-red-600 mb-2">
                    <span className="material-symbols-outlined text-2xl">error</span>
                </div>
                <p className="text-red-700 font-semibold">{error}</p>
                <p className="text-red-600 text-sm mt-1">Menampilkan produk demo sebagai gantinya</p>
            </div>
        )}

        {/* Content - only show when not loading */}
        {!loading && (
            <>
                {/* Special Offers Carousel */}
                {saleProducts.length > 0 && (
            <div className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">Penawaran Spesial</h2>
                <div className="flex space-x-6 overflow-x-auto pb-4 -mx-6 px-6">
                    {saleProducts.map(product => <ProductCard key={product.name} product={product} onAddToCart={handleAddToCart} isPromo={true} />)}
                </div>
            </div>
        )}

        {/* Featured Products Section */}
        {featuredProducts.length > 0 && (
            <div className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">Produk Unggulan</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {featuredProducts.map(product => <ProductCard key={product.name} product={product} onAddToCart={handleAddToCart} />)}
                </div>
            </div>
        )}


                {/* All Products Section */}
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center border-t pt-12">Jelajahi Semua Produk</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map(product => <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />)}
                    </div>
                </div>
        
                {/* Floating Cart Button */}
                <button
                    onClick={() => setIsCartOpen(true)}
                    className="fixed bottom-6 right-6 bg-orange-600 text-white rounded-full p-4 shadow-lg hover:bg-orange-700 transition-transform transform hover:scale-110 focus:outline-none z-30 flex items-center justify-center"
                    aria-label={`Buka Keranjang (${cartItemCount} item)`}
                >
                    <span className="material-symbols-outlined text-3xl">shopping_cart</span>
                    {cartItemCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold border-2 border-orange-600">
                            {cartItemCount}
                        </span>
                    )}
                </button>
            </>
        )}
        
        {/* Cart Sidebar */}
        <CartSidebar 
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cartItems={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemove={handleRemoveFromCart}
            onCheckout={handleCheckout}
        />
    </div>
  );
};

export default TangselMart;