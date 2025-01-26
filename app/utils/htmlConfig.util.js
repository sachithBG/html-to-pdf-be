/**
 * Replaces placeholders in the HTML string with actual values from the provided data object.
 * Placeholders are in the format of {{key}}.
 *
 * @param {string} html - The HTML string with placeholders.
 * @param {Object} data - The data object where the keys will be matched to replace the placeholders.
 * @returns {string} - The HTML string with replaced placeholders.
 */
const replacePlaceholders = (html, data, defVal) => {
    return html.replace(/{{(.*?)}}/g, (_, key) => {
        // Trim extra spaces around the key
        const keys = key.trim().split('.'); // Split the key by dot (.) for nested values

        // Traverse the nested keys in the data object
        let value = data;
        for (let k of keys) {
            if (value && value.hasOwnProperty(k)) {
                value = value[k];
            } else {
                value = defVal; // If the key doesn't exist in the object, set the value to an empty string
                break;
            }
        }

        return value || ''; // Return the value or an empty string if no value is found
    });
};

const replacePlaceholdersTbl = (html, data, defVal) => {
    return html.replace(/{{(.*?)}}/g, (_, key) => {
        // Ensure the key matches the "{{any._table_}}" format
        if (!/^[a-zA-Z0-9]+\.?_table_$/.test(key.trim())) {
            return `{{${key}}}`; // Keep the placeholder unchanged if it doesn't match
        }
        // Trim extra spaces around the key
        const keys = key.trim().split('.'); // Split the key by dot (.) for nested values

        // Traverse the nested keys in the data object
        let value = data;
        for (let k of keys) {
            if (value && value.hasOwnProperty(k)) {
                value = value[k];
            } else {
                value = defVal; // If the key doesn't exist in the object, set the value to an empty string
                break;
            }
        }

        return value || ''; // Return the value or an empty string if no value is found
    });
};

const getNestedValue = (obj, path) => {
    return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : null), obj);
};

const imageUrl = 'https://media.istockphoto.com/id/1967543722/photo/the-city-of-london-skyline-at-night-united-kingdom.jpg?s=2048x2048&w=is&k=20&c=ZMquw-lP_vrSVoUlSWjuWIZHdVma7z4ju9pD1EkRPvs='
const tableData = [
    { metric: 'Sales', target: '1000', achieved: '800' },
    { metric: 'Revenue', target: '$5000', achieved: '$4500' },
    { metric: 'Conversion Rate', target: '50%', achieved: '45%' }
];
const tempData = {
    "name": "Job Order 123",
    "date": "2024-12-03",
    "customer": "Customer A",
    "task": {
        id: 1,
        name: "task 124",
        owner: {
            id: 2,
            name: "task owner name"
        }
    },
    tableData
}

const setStyles = (content, ckeditorStyles) => {
    return `
            <!DOCTYPE html>
            <html>
                <head>
                <link rel="stylesheet" href="https://cdn.ckeditor.com/ckeditor5/44.1.0/ckeditor5.css">
                    <style>
                        ${ckeditorStyles} /* CKEditor styles */
                        body {
                            font-family: Arial, sans-serif;
                            margin: 0;
                            padding: 0;
                            color: #333;
                            font-size: 12px; /* Default font size */
                            line-height: 0.1;
                        },
                        .ck-content {
                            max-width: 794px;
                            margin: 0 auto;
                        }
                    </style>
                </head>
                <body>
                <div style="width: 794px;" class="ck ck-editor__main">
                    <div class="ck ck-content">
                        ${content} 
                    </div>
                    </div>
                </body>
            </html>
        `
}

const setStyles2 = (content, ckeditorStyles, margin) => {
    return `
            <!DOCTYPE html>
            <html>
                <head>
                
                    <style>
                    ${ckeditorStyles} /* CKEditor styles */
                        body {
                            font-family: Arial, sans-serif;
                            margin: 0;
                            padding: 0;
                            color: #333;
                            font-size: 12px; /* Default font size */
                            line-height: 0.1;
                        },
                        .ck-content {
                            max-width: 794px;
                            margin: 0 auto;
                        }
                    </style>
                </head>
                <body>
                <div style="width: 794px;margin-left: ${margin.left}; margin-right: ${margin.right};" class="ck ck-editor__main">
                    <div class="ck ck-content">
                        ${content} 
                    </div>
                    </div>
                </body>
            </html>
        `
}


module.exports = {
    replacePlaceholders,
    replacePlaceholdersTbl,
    imageUrl,
    tempData,
    tableData,
    getNestedValue,
    setStyles,
    setStyles2
}