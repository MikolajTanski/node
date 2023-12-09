import { permissions } from "../utility/permissions.js";

class HtmlHelper {
    /*
    <select name="cars" id="cars-select" class="">
        <option value="1">School 001</option> 
        <option value="2" selected>School 002</option> 
        <option value="3">School 003</option> 
    </select>
    */
    
    getSelectIdCodeFromArr(arr, selectName, propertyToShow, id, className, selectedId = -1) {
        let idCode = "";
        if (id) idCode = `id="${id}"`;
        let html = `<select name="${selectName}" ${idCode} class="${className}" >`;

        for (const el of arr) {
            let data = "";
            if (selectedId === el.id) data = `selected`;

            html += `\n <option value="${el.id}" ${data}> ${el[propertyToShow]} </option>`;
        }

        return html + `\n</select>`;
    }


    // arr = ["admin", "teacher"]
    getSelectCodeFromArr(arr, selectName, id, className, selectedValue) {
        let idCode = "";
        if (id) idCode = `id="${id}"`;
        let html = `<select name="${selectName}" ${idCode} class="${className}" >`;

        for (const str of arr) {
            let data = "";
            if (selectedValue === str) data = "selected";
            html += `\n <option value="${str}" ${data} >${str}</option>`;
        }

        return html + "\n</select>";
    }


    // pobierze wartość z tablicy po id
    getElValueFromArrById(arr, id, propertyToShow = "id") {
        for (const el of arr) {
            if (el.id === id) return el[propertyToShow];
        }

        return null;
    }

    getLinkCodeForUserRoleOrHigher(
        userRole,
        minRoleForLink = "admin", // np jeśli role teacher to nie ma dostępu do linka admina
        href,
        linkText,
        className = ""
    ) {
        const userPriority = permissions.getPriorityByRole(userRole); // teacher to 3
        const minRolePriorityToSeeLink = permissions.getPriorityByRole(minRoleForLink); // student to 2

        // czy 3 >= 2  tak, jest dostęp
        if ( userPriority >= minRolePriorityToSeeLink ) {
            return `<a href="${href}" class="${className}"> ${linkText} </a> `;
        }

        return ""; // nie ma dostępu, nie ma linka
    }

    hasAccessForUserRoleOrHigher( userRole, minRoleForAccess = "admin" ) {
        const userPriority = permissions.getPriorityByRole(userRole); // teacher to 3
        const minRolePriorityToSeeLink = permissions.getPriorityByRole(minRoleForAccess); // student to 2

        // czy 3 >= 2  tak, jest dostęp
        if ( userPriority >= minRolePriorityToSeeLink ) {
            return true; // ma dostęp do zasobu
        }

        return false; // nie ma dostępu
    }

}

const htmlHelper = new HtmlHelper();

export {
    htmlHelper
}