# **Setup Module**

Guides users through business creation and initial configuration in a 3-step wizard.

---

## **Table of Contents**

- Features
- API Integration
- State Management
- Error Handling
- Styling
- Dependencies

---

## **Features**

| **Feature** | **Description** | **Component** | **File** |
| --- | --- | --- | --- |
| **Business Selection** | Choose between creating new or joining existing business | **`ChooseBusiness`** | **`ChooseBusiness.jsx`** |
| **Basic Info** | Collect name, URL, and address (Step 1) | **`Step1`** | **`Step1.jsx`** |
| **Dietary Settings** | Configure allergens and diet options (Step 2) | **`Step2`** | **`Step2.jsx`** |
| **Layout Preference** | Select default menu item display style (Step 3) | **`Step3`** | **`Step3.jsx`** |
| **Progress Tracking** | Visual progress bar and step navigation | **`SetUp`** | **`SetUp.jsx`** |

---

## **API Integration**

### **Endpoints**

| **Endpoint** | **Method** | **Payload** | **Called In** | **Purpose** |
| --- | --- | --- | --- | --- |
| **`/api/businesses/`** | **`GET`** | None | **`ChooseBusiness`** (fetch list) | Get existing businesses |
| **`/api/businesses`** | **`POST`** | **`{ name, url, address, allergens, diets }`** | **`ChooseBusiness`**/**`SetUp`** | Create new business |
| **`/api/auth/set-business`** | **`POST`** | **`{ type: "new/existing", business_id }`** | **`ChooseBusiness`** | Link user to business |
| **`/api/menus`** | **`POST`** | **`{ title: "Master Menu", restaurant: id }`** | **`ChooseBusiness`** | Create default menu |
| **`/api/businesses/:id`** | **`PUT`** | **`{ allergens, diets, menuLayout }`** | **`SetUp`** (final step) | Complete setup |

---

## **State Management**

| **State Variable** | **Type** | **Component** | **Purpose** |
| --- | --- | --- | --- |
| **`formData`** | **`Object`** | **`SetUp`** | Aggregates all steps' data (**`name`**, **`allergens`**, **`menuLayout`**, etc.) |
| **`localData`** | **`Object`** | **`Step1`** | Manages address sub-fields before concatenation |
| **`selectedAllergens`** | **`Array`** | **`Step2`** | Tracks checked allergen options |
| **`selectedDiets`** | **`Array`** | **`Step2`** | Tracks checked diet options |
| **`selectedOption`** | **`String`** | **`Step3`** | Stores chosen layout preference (**`layout1`**/**`layout2`**) |
| **`business_id`** | **`String`** | **`ChooseBusiness`** | Caches created business ID in localStorage |

---

## **Error Handling**

| **Scenario** | **Handling Method** | **Component** |
| --- | --- | --- |
| **Duplicate business name** | **`400`** response + alert | **`SetUp`** |
| **Invalid address fields** | Required fields (**`*`**) prevent submission | **`Step1`** |
| **API failures** | **`try/catch`** + **`ErrorMessage`** component | **`ChooseBusiness`** |
| **Missing business selection** | Disabled "Next" button until radio selected | **`ChooseBusiness`** |

---

## **Styling**

| **File** | **Key Styles** | **Components Affected** |
| --- | --- | --- |
| **`setup.scss`** | Progress bar, form layouts, responsive grids | All setup components |
| **Radio/Checkbox UI** | Custom-styled inputs with visual feedback | **`Step2`**, **`Step3`** |
| **Address Form** | Multi-field responsive grid | **`Step1`** |

---

## **Dependencies**

| **Dependency** | **Purpose** |
| --- | --- |
| **`react-router-dom`** | Navigation between steps (**`/step1`** → **`/step2`**) |
| **`react-select`** | Business dropdown in **`ChooseBusiness`** |
| **LocalStorage API** | Persists **`business_id`** during setup flow |
| **Cookie API** | Sets **`hasBusiness`** flag on completion |