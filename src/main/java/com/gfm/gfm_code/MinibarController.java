package com.gfm.gfm_code;

import javafx.fxml.FXML;
import javafx.scene.control.*;
import javafx.scene.image.ImageView;

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
}