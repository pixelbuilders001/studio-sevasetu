export type RepairQuote = {
    id: string;
    labor_cost: number;
    parts_cost: number;
    total_amount: number;
    notes: string;
    status: string;
};

export type Booking = {
    id: string;
    order_id: string;
    status: string;
    created_at: string;
    media_url: string | null;
    completion_code?: string;
    categories: {
        id: string;
        name: string;
    };
    issues: {
        id: string;
        title: string;
    };
    repair_quotes: RepairQuote[];
    // Added fields used in InvoicePreviewSheet (even if dummy)
    final_amount_paid?: number;
    net_inspection_fee?: number;
    user_name?: string;
    full_address?: string;
    technicians?: {
        full_name: string;
    };
};
