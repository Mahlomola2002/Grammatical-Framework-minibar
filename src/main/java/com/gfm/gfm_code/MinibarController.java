package com.gfm.gfm_code;

import javafx.fxml.FXML;
import javafx.scene.control.Label;

/**
 * @author Michael Fu
 * @author Craig Moug
 * @author Mahlomola Mohlomi
 */
public class MinibarController {
    @FXML
    private Label welcomeText;

    @FXML
    protected void onHelloButtonClick() {
        welcomeText.setText("Welcome to JavaFX Application!");
    }
}