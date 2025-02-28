function getHousingRentRange(balance: number): string {
    if (balance < 30000) return "20-25%";
    if (balance < 80000) return "25-30%";
    return "30-35%";
}

function getGroceriesUtilitiesRange(balance: number): string {
    if (balance < 30000) return "20-25%";
    if (balance < 80000) return "15-20%";
    return "12-15%";
}

function getTransportationRange(balance: number): string {
    if (balance < 30000) return "5-8%";
    if (balance < 80000) return "5-10%";
    return "5-10%";
}

function getEmergencyFundRange(balance: number): string {
    if (balance < 30000) return "10-12%";
    if (balance < 80000) return "8-10%";
    return "5-8%";
}

function getInvestmentsRange(balance: number): string {
    if (balance < 30000) return "8-10%";
    if (balance < 80000) return "15-20%";
    return "20-25%";
}

function getHealthInsuranceRange(): string {
    return "3-5%";
}

function getEntertainmentDiningRange(balance: number): string {
    if (balance < 30000) return "3-5%";
    if (balance < 80000) return "5-8%";
    return "8-10%";
}

function getShoppingRange(balance: number): string {
    if (balance < 30000) return "2-3%";
    if (balance < 80000) return "3-5%";
    return "5-7%";
}

function getPersonalCareRange(balance: number): string {
    if (balance < 30000) return "1-2%";
    return "2-4%";
}

export {
    getHousingRentRange,
    getGroceriesUtilitiesRange,
    getTransportationRange,
    getEmergencyFundRange,
    getInvestmentsRange,
    getHealthInsuranceRange,
    getEntertainmentDiningRange,
    getShoppingRange,
    getPersonalCareRange
}