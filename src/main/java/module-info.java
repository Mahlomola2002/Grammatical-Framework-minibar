module com.gfm.gfm {
    requires javafx.controls;
    requires javafx.fxml;

    requires org.controlsfx.controls;
    requires com.dlsc.formsfx;
    requires org.kordamp.ikonli.javafx;

    opens com.gfm.gfm_code to javafx.fxml;
    exports com.gfm.gfm_code;
}