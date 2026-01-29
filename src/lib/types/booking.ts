export type RepairQuote = {
    id: string;
    labor_cost: number;
    parts_cost: number;
    total_amount: number;
    notes: string;
    status: string;
    final_amount_to_be_paid?: number;
};

export type Booking = {
    id: string;
    order_id: string;
    status: string;
    created_at: string;
    media_url: string | null;
    completion_code?: string;
    user_rating?: number;
    preferred_service_date: string;
    preferred_time_slot: string;
    booking_for: string;
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
    payment_method?: string | null;
    referral_code?: string | null;
    final_amount_to_be_paid?: number;
    net_inspection_fee?: number;
    user_name?: string;
    mobile_number?: string;
    full_address?: string;
    technician_id?: string | null;
    technicians?: {
        full_name: string;
    };
};
