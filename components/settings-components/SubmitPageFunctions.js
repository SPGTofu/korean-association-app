// checks if field is missing in the first page of submitting a business
export const checkIfBusinessDataFieldsAreMissing = (businessData) => {
    const validationObject = [
        { field: businessData.businessName, 
          message: 'Please provide the business name' },
        { field: businessData.businessPhoneNumber,
          message: 'Please provide the business number' },
        { field: businessData.businessAddress,
          message: 'Please provide the business address' },
        { field: businessData.businessDescription,
          message: 'Please provide the business description' }
    ];

    const invalidFieldFound = validationObject.find(validation => validation.field === "");

    if (invalidFieldFound) return invalidFieldFound.message;
    return 'CHECK_PASSED';
}

/* 
    checks if all hours fields are filled properly
    IF isOpen == false, doesn't matter
    IF isOpen == true, openTime and closeTime should be filled
*/

export const checkIfBusinessHoursAreMissing = (businessHours) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    for (let i = 0; i < businessHours.length; i++) {
        const day = businessHours[i];
        if (day.isOpen && (day.openTime === "" || day.closeTime === "")) {
                const errorMessage = `Please fill out the hours for ${days[i]}`;
                return errorMessage;
        }
    }
    return 'CHECK_PASSED'
}