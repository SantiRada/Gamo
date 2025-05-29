// === ENTRADA PRINCIPAL ===
Start
  = _ blocks:(Block _)* {
      return Object.fromEntries(blocks.map(([block]) => [block.name, block.entries]));
  }

// === ESPACIADO ===
_  = [ \t\r\n]*    // opcional
__ = [ \t\r\n]+    // obligatorio

// === BLOQUE ===
Block
  = name:BlockName __ "=>" __ entries:(Entry _)* {
      return {
        name,
        entries: Object.fromEntries(entries.map(([entry]) => entry)
      };
    }

// === ENTRADA CLAVE:VALOR ===
Entry
  = key:QuotedString _ ":" _ value:QuotedString {
      return [key.join(''), value.join('')]; // key y value ya son strings
  }

// === IDENTIFICADOR DE BLOQUE ===
BlockName
  = first:[a-zA-Z_] rest:[a-zA-Z0-9_]* {
      return [first.join(''), ...rest.join('')];
    }

// === STRINGS ENTRE COMILLAS ===
QuotedString
  = "\"" chars:QuotedChar* "\"" {
      return chars.join('');  // ❗ NECESARIO PARA CONVERTIR ARRAY A STRING
    }


QuotedChar
  = !["\\"] .  // cualquier carácter excepto comilla o backslash
