import { Customer, UserProduct, Claim } from '../types';
import { availableProductOfferings } from '../constants';

const getRandomProducts = (): UserProduct[] => {
    const products: UserProduct[] = [];
    const numProducts = Math.floor(Math.random() * 3) + 1; // 1 to 3 products per user

    for (let i = 0; i < numProducts; i++) {
        const productOffering = availableProductOfferings[Math.floor(Math.random() * availableProductOfferings.length)];
        
        // 50% chance of a product having a claim
        const claims: Claim[] = [];
        if (productOffering.isClaimable && Math.random() > 0.5) {
            const status = Math.random() > 0.3 ? 'Paid' : 'Pending';
            claims.push({
                id: crypto.randomUUID().substring(0, 8),
                type: 'Drought/Crop Failure',
                description: 'Severe lack of rain damaged the season\'s maize crop.',
                dateFiled: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
                status: status,
                payoutTarget: productOffering.cover,
                ...(status === 'Paid' && { payoutAmount: typeof productOffering.cover === 'number' ? productOffering.cover : 500000 })
            });
        }

        const newProduct: UserProduct = {
            id: crypto.randomUUID(),
            productName: productOffering.name,
            type: productOffering.type,
            SACCO: productOffering.SACCO,
            insurer: productOffering.insurerChoices[0],
            premiumWeekly: productOffering.premiumWeekly,
            coverageAmount: productOffering.cover,
            startDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
            endDate: null,
            status: 'Active',
            isClaimable: productOffering.isClaimable,
            claims: claims,
            lastPayment: new Date().toISOString(),
            color: productOffering.color,
            category: productOffering.category,
        };
        products.push(newProduct);
    }
    return products;
};

export const generateMockCustomers = (count: number): Customer[] => {
    const customers: Customer[] = [];
    const saccos = ['Mbale Farmers SACCO', 'Gulu Community SACCO', 'URA STAFF SACCO', 'Jinja Traders SACCO'];
    for (let i = 0; i < count; i++) {
        const sacco = saccos[i % saccos.length]; // Cycle through SACCOs
        customers.push({
            userId: `user_${crypto.randomUUID().substring(0, 12)}`,
            sacco: sacco,
            products: getRandomProducts(),
        });
    }
    return customers;
};
