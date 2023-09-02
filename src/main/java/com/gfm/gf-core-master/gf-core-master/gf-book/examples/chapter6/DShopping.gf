abstract DShopping = {
  flags startcat = Comment ;
  cat
    Comment ; 
    Dom ;
    Item Dom ; 
    Kind Dom ; 
    Quality Dom ;
  fun
    DFood, DCloth : Dom ;

    Pred : (d : Dom) -> Item d -> Quality d -> Comment ;
    This, That : (d : Dom) -> Kind d -> Item d ;
    Mod : (d : Dom) -> Quality d -> Kind d -> Kind d ;
    Wine, Cheese, Fish : Kind DFood ;
    Very : (d : Dom) -> Quality d -> Quality d ;
    Fresh, Warm, Delicious, Boring : Quality DFood ;

    Shirt, Jacket : Kind DCloth ;
    Comfortable : Quality DCloth ;

    Italian, Expensive, Elegant : (d : Dom) -> Quality d ;

  lincat
    Comment = Str ;
    Dom = {s : Str} ;
    Item d = {i : Kind d ; s : Str} ;
    Kind d = {k : Str} ;
    Quality d = {q : Str} ;

  lin
    Pred d i q = q ++ " " ++ i.s ++ " is " ++ q ++ " in " ++ d.s ++ "." ;
    This d k = "This " ++ k.k ++ " in " ++ d.s ;
    That d k = "That " ++ k.k ++ " in " ++ d.s ;
    Mod d q k = q.q ++ " " ++ k.k ;
    Very d q = "very " ++ q.q ;

  lincat
    Comment = StrEng | StrSpa ;
    Dom = {s : StrEng | StrSpa} ;
    Item d = {i : Kind d ; s : StrEng | StrSpa} ;
    Kind d = {k : StrEng | StrSpa} ;
    Quality d = {q : StrEng | StrSpa} ;
}

lin DShopping = open DShopping in {
  lincat
    Comment = mkStr ;
    Dom = {s = "domain"} ;
    Item d = {i = {k = "item"}, s = "item"} ;
    Kind d = {k = "kind"} ;
    Quality d = {q = "quality"} ;

  lin
    Pred d i q = "The " ++ i.s ++ " is " ++ q.q ++ " in the " ++ d.s ++ " domain." ;
    This d k = "This " ++ k.k ++ " is in the " ++ d.s ++ " domain." ;
    That d k = "That " ++ k.k ++ " is in the " ++ d.s ++ " domain." ;
    Mod d q k = "A " ++ q.q ++ " " ++ k.k ;
    Very d q = "very " ++ q.q ;
}

