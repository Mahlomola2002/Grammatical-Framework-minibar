package com.gfm.gfm_code;
import org.grammaticalframework.pgf.*;

import java.io.FileNotFoundException;
import java.util.*;

public class ReadFile {
    String file;
    PGF pgf=null;
    HashSet<String> words=null;
    String startCat;
    Map<String,Concr> langauges;
    List<String>categories;
    String startLang;
    Concr concr;
    public ReadFile(String filename){
        this.file=filename;

    }
    public HashSet<String> getWords(){return words;}

    public void read(){
        try {
            pgf = PGF.readPGF("C:/Users/mahlomola/OneDrive - University of Cape Town/javaScript/Capstone/Project/src/grammars/Phrasebook.pgf");

            // Other code related to f...
        } catch (FileNotFoundException e) {
            // Handle the exception here
            System.out.println("File not found: " + e.getMessage());
            e.printStackTrace();
        }

    }
    public String getStartCat(){
        return pgf.getStartCat();
    }
    public Map<String,Concr> getLangauges(){
        langauges=pgf.getLanguages();
        return langauges;
    }
    public List<String> getCategories(){
        categories=pgf.getCategories();
        return categories;
    }
    public void setStartLang(String lang){

        concr=pgf.getLanguages().get(lang);
    }
    public HashSet<String> generateWords(String input) throws ParseError {
        HashSet<String> words = new HashSet<>();


        Concr concr=pgf.getLanguages().get("PhrasebookEng");


        Iterable<TokenProb> ex = concr.complete("Message", "",input );
        for (TokenProb tb : ex) {
            String token=tb.getToken();
            if(words.contains(token)==false){
                words.add(token);
                }
        }
        return words;
    }


}
