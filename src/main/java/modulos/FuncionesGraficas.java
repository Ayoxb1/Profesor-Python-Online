package modulos;

import java.awt.*;
import java.io.File;
import javax.swing.*;

public class FuncionesGraficas {

    private static ImageIcon cargarImagen(String ruta, double escala) {
        if (ruta == null || ruta.isEmpty()) return null;
        File f = new File(ruta);
        if (!f.exists()) {
            f = new File(ruta.replace("imagenes", "Imagenes"));
        }
        if (!f.exists()) {
            f = new File(ruta.replace("Imagenes", "imagenes"));
        }
        if (!f.exists()) return null;

        ImageIcon icon = new ImageIcon(f.getAbsolutePath());
        if (icon.getIconWidth() <= 0 || icon.getIconHeight() <= 0) return null;
        int w = (int) (icon.getIconWidth() * escala);
        int h = (int) (icon.getIconHeight() * escala);
        if (w > 0 && h > 0) {
            Image img = icon.getImage().getScaledInstance(w, h, Image.SCALE_SMOOTH);
            return new ImageIcon(img);
        }
        return icon;
    }

    public static void FotoMensajeSonidoAutomatica(String titulo, String rutaFoto, String mensaje, String rutaSonido, int duracion, double escala, int x, boolean loop) {
        ImageIcon icon = cargarImagen(rutaFoto, escala);
        JDialog dialog = new JDialog((Frame) null, titulo, true);
        dialog.setLayout(new BorderLayout(10, 10));

        if (icon != null) {
            JLabel lblFoto = new JLabel(icon);
            lblFoto.setHorizontalAlignment(SwingConstants.CENTER);
            dialog.add(lblFoto, BorderLayout.CENTER);
        }

        if (mensaje != null && !mensaje.isEmpty()) {
            JLabel lblMsg = new JLabel("<html><div style='text-align: center; padding: 8px;'>" + mensaje.replace("\n", "<br>") + "</div></html>");
            lblMsg.setHorizontalAlignment(SwingConstants.CENTER);
            dialog.add(lblMsg, BorderLayout.SOUTH);
        }

        Timer timer = new Timer(duracion * 1000, e -> dialog.dispose());
        timer.setRepeats(false);
        timer.start();

        dialog.pack();
        dialog.setLocationRelativeTo(null);
        dialog.setVisible(true);
    }

    public static void FotoyMensaje(String titulo, String rutaFoto, String mensaje, double escala, boolean modal) {
        ImageIcon icon = cargarImagen(rutaFoto, escala);
        Object content = (mensaje != null && !mensaje.isEmpty()) ? mensaje : " ";
        JOptionPane.showMessageDialog(null, content, titulo, JOptionPane.PLAIN_MESSAGE, icon);
    }

    public static String pedirDatos(String titulo, String mensaje) {
        String res = JOptionPane.showInputDialog(null, mensaje, titulo, JOptionPane.QUESTION_MESSAGE);
        return (res != null) ? res : "";
    }

    public static String FotoYPedirDatos(String titulo, String rutaFoto, String mensaje, double escala, boolean modal) {
        ImageIcon icon = cargarImagen(rutaFoto, escala);
        Object res = JOptionPane.showInputDialog(null, mensaje, titulo, JOptionPane.QUESTION_MESSAGE, icon, null, "");
        return (res != null) ? res.toString() : "";
    }

    public static int FotoMensajeMenu(String titulo, String[] opciones, String rutaFoto, String mensaje, double escala, boolean modal) {
        ImageIcon icon = cargarImagen(rutaFoto, escala);
        int res = JOptionPane.showOptionDialog(
            null,
            mensaje,
            titulo,
            JOptionPane.DEFAULT_OPTION,
            JOptionPane.PLAIN_MESSAGE,
            icon,
            opciones,
            (opciones != null && opciones.length > 0) ? opciones[0] : null
        );
        return res;
    }

    public static int pedirEntero(String titulo, String mensaje) {
        while (true) {
            String str = JOptionPane.showInputDialog(null, mensaje, titulo, JOptionPane.QUESTION_MESSAGE);
            if (str == null) return 0;
            try {
                return Integer.parseInt(str.trim());
            } catch (NumberFormatException e) {
                JOptionPane.showMessageDialog(null, "Por favor, introduce un número entero válido.", "Error", JOptionPane.ERROR_MESSAGE);
            }
        }
    }

    public static void warning(String titulo, String mensaje) {
        JOptionPane.showMessageDialog(null, mensaje, titulo, JOptionPane.WARNING_MESSAGE);
    }

    public static void mostrarMensaje(String titulo, String mensaje, int tipo) {
        JOptionPane.showMessageDialog(null, mensaje, titulo, tipo);
    }

    public static void mostrarDatos(String titulo, String datos) {
        JOptionPane.showMessageDialog(null, datos, titulo, JOptionPane.INFORMATION_MESSAGE);
    }

    public static int menu(String titulo, String[] opciones, int n) {
        int res = JOptionPane.showOptionDialog(
            null,
            "Selecciona una opción:",
            titulo,
            JOptionPane.DEFAULT_OPTION,
            JOptionPane.QUESTION_MESSAGE,
            null,
            opciones,
            (opciones != null && opciones.length > 0) ? opciones[0] : null
        );
        return res;
    }
}
