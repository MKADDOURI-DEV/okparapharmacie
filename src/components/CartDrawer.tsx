'use client';
import React from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { useCart } from '@/context/CartContext';

export default function CartDrawer() {
  const { state, dispatch, totalItems, totalPrice } = useCart();
  const DELIVERY_FEE = 30;
  const FREE_DELIVERY_THRESHOLD = 500;
  const deliveryFee = totalPrice >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;

  if (!state?.isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={() => dispatch({ type: 'CLOSE_CART' })}
      />
      <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-card z-50 shadow-drawer flex flex-col animate-slide-up">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Icon name="ShoppingCartIcon" size={20} className="text-primary" />
            <span className="font-display font-semibold text-lg">Mon Panier</span>
            <span className="badge-discount">{totalItems}</span>
          </div>
          <button onClick={() => dispatch({ type: 'CLOSE_CART' })} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <Icon name="XMarkIcon" size={20} />
          </button>
        </div>

        {state?.items?.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
              <Icon name="ShoppingBagIcon" size={32} className="text-muted-foreground" />
            </div>
            <p className="font-semibold text-foreground">Votre panier est vide</p>
            <p className="text-sm text-muted-foreground">Découvrez nos produits et ajoutez-les à votre panier</p>
            <Link
              href="/product-catalog"
              onClick={() => dispatch({ type: 'CLOSE_CART' })}
              className="mt-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Voir les produits
            </Link>
          </div>
        ) : (
          <>
            {totalPrice < FREE_DELIVERY_THRESHOLD && (
              <div className="mx-4 mt-3 p-3 bg-accent/10 rounded-xl">
                <p className="text-xs text-accent font-semibold text-center">
                  Plus que {FREE_DELIVERY_THRESHOLD - totalPrice} د.م. pour la livraison gratuite!
                </p>
                <div className="mt-2 h-1.5 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((totalPrice / FREE_DELIVERY_THRESHOLD) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {state?.items?.map(item => (
                <div key={item?.product?.id} className="flex gap-3 p-3 bg-muted/50 rounded-xl">
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-white">
                    <AppImage
                      src={item?.product?.image}
                      alt={item?.product?.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">{item?.product?.brand}</p>
                    <p className="text-sm font-semibold line-clamp-2 leading-tight">{item?.product?.name}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => dispatch({ type: 'UPDATE_QUANTITY', productId: item?.product?.id, quantity: item?.quantity - 1 })}
                          className="quantity-btn !w-7 !h-7"
                        >
                          <Icon name="MinusIcon" size={12} />
                        </button>
                        <span className="w-7 text-center text-sm font-bold">{item?.quantity}</span>
                        <button
                          onClick={() => dispatch({ type: 'UPDATE_QUANTITY', productId: item?.product?.id, quantity: item?.quantity + 1 })}
                          className="quantity-btn !w-7 !h-7"
                        >
                          <Icon name="PlusIcon" size={12} />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-primary price-tag">{(item?.product?.price * item?.quantity)?.toFixed(0)} د.م.</span>
                        <button
                          onClick={() => dispatch({ type: 'REMOVE_ITEM', productId: item?.product?.id })}
                          className="p-1 text-muted-foreground hover:text-red-500 transition-colors"
                        >
                          <Icon name="TrashIcon" size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-4 py-4 border-t border-border space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Sous-total</span>
                <span className="font-semibold price-tag">{totalPrice?.toFixed(0)} د.م.</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Livraison</span>
                <span className={`font-semibold ${deliveryFee === 0 ? 'text-primary' : ''}`}>
                  {deliveryFee === 0 ? 'Gratuite' : `${deliveryFee} د.م.`}
                </span>
              </div>
              <div className="flex justify-between font-bold text-base border-t border-border pt-3">
                <span>Total</span>
                <span className="text-primary price-tag">{(totalPrice + deliveryFee)?.toFixed(0)} د.م.</span>
              </div>
              <button className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity shimmer-btn relative overflow-hidden">
                Commander — Paiement à la livraison
              </button>
              <button
                onClick={() => dispatch({ type: 'CLEAR_CART' })}
                className="w-full py-2 text-xs text-muted-foreground hover:text-red-500 transition-colors"
              >
                Vider le panier
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}