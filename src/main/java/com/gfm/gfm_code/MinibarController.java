package com.gfm.gfm_code;

import javafx.fxml.FXML;
import javafx.scene.control.*;
import javafx.scene.image.ImageView;

import javax.swing.*;
import java.util.HashSet;
import javafx.collections.ObservableList;
import javafx.collections.FXCollections;
import org.grammaticalframework.pgf.ParseError;

/**
 * @author Michael Fu
 * @author Craig Moug
 * @author Mahlomola Mohlomi
 */
public class MinibarController {
    @FXML
    private Label predictedLabel;
    @FXML
    private Label translationLabel;
    @FXML
    private Button button1;
    @FXML
    private ImageView logo;
    @FXML
    private ComboBox<String> grammarBox;
    @FXML
    private ComboBox<String> startcatBox;
    @FXML
    private ComboBox<String> fromBox;
    @FXML
    private ComboBox<String> toBox;
    @FXML
    private TextArea translationArea;
    @FXML
    private TextArea predictionArea;
    @FXML
    private TextField inputArea;
    @FXML
    private Button deleteButton;
    @FXML
    private Button shrinkButton;
    @FXML
    private Button expandButton;
    @FXML
    private ScrollPane translationPane;
    @FXML
    private Button load;
    @FXML

    HashSet<String> PathList=new HashSet<>();
    HashSet<String>grammarToDisplay=new HashSet<>();
    ReadFile file;


    @FXML
    public void initialize() {
        ObservableList<String> fromBoxItems = FXCollections.observableArrayList(grammarToDisplay);
        grammarBox.setItems(fromBoxItems);

    }

    protected void onDeleteButtonClick(){
        inputArea.clear();
    }
    @FXML
    protected void shrinkTranslation(){
        double newHeight = translationPane.getHeight()-50;
        translationPane.setPrefHeight(newHeight);
    }

    @FXML
    protected void expandTranslation(){
        double newHeight = translationPane.getHeight()+50;
        translationPane.setPrefHeight(newHeight);
    }
    @FXML
    protected void load() throws ParseError {
        JFileChooser fileChooser = new JFileChooser();

        // Set the file chooser to open mode (you can change this to fit your needs)
        int result = fileChooser.showOpenDialog(null);

        if (result == JFileChooser.APPROVE_OPTION) {
            // Get the selected file
            java.io.File selectedFile = fileChooser.getSelectedFile();

            // Get the path of the selected file
            String filePath = selectedFile.getAbsolutePath();

            PathList.add(filePath);
            String[] name = filePath.split("\\\\");
            grammarToDisplay.add(name[name.length-1]);

            // Update the ComboBox directly with the new item
            grammarBox.getItems().add(name[name.length-1]);

            System.out.println("Selected File: " + filePath);
            System.out.println(grammarToDisplay);
             file=new ReadFile(filePath);
            file.read();
            ObservableList<String> startCategory = FXCollections.observableArrayList(file.getCategories());
            startcatBox.setItems(startCategory);
            ObservableList<String> lang = FXCollections.observableArrayList(file.getLangauges().keySet());
            fromBox.setItems(lang);

            toBox.setItems(lang);
            displayWordList( file.generateWords(""),predictionArea);
            inputArea.setOnKeyReleased(event -> {
                try {
                    getTypeInput();
                } catch (ParseError parseError) {
                    parseError.printStackTrace();
                }
            });


        }
    }
    @FXML
    protected void displayListOfGrammar(){
        for(String p: PathList){
            String[] name = p.split("\\\\");
            grammarToDisplay.add(name[name.length-1]);
            String g="";


        }
    }
    @FXML
    private void getTypeInput() throws ParseError {
        String userInput = inputArea.getText();
        displayWordList(file.generateWords(userInput), predictionArea);



    }
    public void displayWordList(HashSet<String> wordList, TextArea words) {
        StringBuilder sb = new StringBuilder();
        int wordCount = 0;

        for (String word : wordList) {
            sb.append(word).append(" ");
            wordCount++;

            // Insert a newline after every sixth word
            if (wordCount % 16 == 0) {
                sb.append("\n");
            }
        }

        words.setText(sb.toString());
    }





}