/**
 * Converte um código de cor hexadecimal para um valor de cor decimal
 * @param {string} hex - O código de cor hexadecimal (com ou sem prefixo #)
 * @returns {number} O valor da cor em decimal
 */
export function hexToDecimal(hex) {
    // Remove o hash se existir
    hex = hex.replace(/^#/, "");

    // Analisa o valor hexadecimal para decimal
    if (hex.length === 3) {
        // Para hex abreviado (ex: #F00), converte para forma completa primeiro
        hex =
            hex.charAt(0) +
            hex.charAt(0) +
            hex.charAt(1) +
            hex.charAt(1) +
            hex.charAt(2) +
            hex.charAt(2);
    } else if (hex.length !== 6) {
        throw new Error("Invalid hex color format");
    }

    // Converte a string hexadecimal para um número decimal
    return parseInt(hex, 16);
}
