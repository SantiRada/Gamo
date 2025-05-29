// === ENTRADA PRINCIPAL ===
Start
  = "dialog" __ name:DialogName _ "{" __ content:(BlockContent __)* "end()" _ "}" (_ / __)? {
      return {
        type: "dialog",
        name,
        content: content.map(c => c[0])
      };
    }
    
// === ESPACIADO ===
_  = [ \t\r\n]*
__ = [ \t\r\n]+

// === IDENTIFICADOR DE ESCENA (Empieza con mayúscula) ===
DialogName = name:[A-Z][a-zA-Z0-9_]* { return name; }

// === CONTENIDO DEL BLOQUE PRINCIPAL ===
BlockContent
  = Phrase
  / OptionList
  / NamedBlock

// === FRASE ===
Phrase
  = from:Text _ "=>" _ to:Text InlineAction? {
      return {
        type: "phrase",
        from,
        to,
        action: arguments[4] ?? null
      };
    }

// === IDENTIFICADORES SIN COMILLAS (letras, números, guion bajo) ===
Identifier = [a-zA-Z_][a-zA-Z0-9_]* { return text(); }

// === OPCIONES ===
OptionList
  = "[" _ "options:" __ options:OptionEntry+ _ "]" {
      return {
        type: "options",
        options
      };
    }

OptionEntry
  = key:Text _ ":" _ action:OptionAction __ {
      return {
        type: "option",
        key,
        action
      };
    }

// === BLOQUE NOMBRADO ===
NamedBlock
  = name:TextOrIdentifier _ "{" __ content:(BlockContent __)* "}" {
      return {
        type: "block",
        name,
        content: content.map(c => c[0])
      };
    }

// === ACCIONES ===
InlineAction
  = __ OptionAction

OptionAction
  = "branch" _ "(" _ name:TextOrIdentifier _ ")" {
      return { type: "branch", name };
    }
  / "event" _ "(" _ name:TextOrIdentifier _ ")" {
      return { type: "event", name };
    }
  / "continue" {
      return { type: "continue" };
    }
  / "break" {
      return { type: "break" };
    }

// === TEXTO ENTRE COMILLAS ===
Text
  = "\"" chars:[^"]* "\"" { return chars.join(""); }
  / "'" chars:[^']* "'" { return chars.join(""); }

// === TEXTO ENTRE COMILLAS O IDENTIFICADOR ===
TextOrIdentifier
  = Text
  / Identifier