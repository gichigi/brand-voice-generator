/**
 * Validates form data for brand voice generation
 * @param formData The form data to validate
 * @returns boolean indicating if the form data is valid
 */
export function validateFormData(formData: { [key: string]: any }): boolean {
  // Check if required fields are present and not empty
  const requiredFields = ["businessName", "yearFounded", "businessDescription", "businessValues"]

  for (const field of requiredFields) {
    if (
      !formData[field] ||
      (typeof formData[field] === "string" && formData[field].trim() === "") ||
      (Array.isArray(formData[field]) && formData[field].length === 0)
    ) {
      return false
    }
  }

  return true
}

/**
 * Validates content generation form data
 * @param formData The form data to validate
 * @returns boolean indicating if the form data is valid
 */
export function validateContentFormData(formData: { [key: string]: any }): boolean {
  // Check if required fields are present and not empty
  const requiredFields = ["contentType", "topic", "targetAudience", "contentLength"]

  for (const field of requiredFields) {
    if (!formData[field] || (typeof formData[field] === "string" && formData[field].trim() === "")) {
      return false
    }
  }

  return true
}
