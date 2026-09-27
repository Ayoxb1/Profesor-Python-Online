package jaco.mp3.player;

import java.io.File;
import javax.sound.sampled.*;

public class MP3Player {
    private File file;
    private volatile boolean stopped = true;
    private Clip clip;

    public MP3Player() {}

    public MP3Player(File file) {
        this.file = file;
    }

    public synchronized void play() {
        this.stopped = false;
        if (file != null && file.getName().toLowerCase().endsWith(".wav")) {
            try {
                AudioInputStream ais = AudioSystem.getAudioInputStream(file);
                clip = AudioSystem.getClip();
                clip.open(ais);
                clip.start();
            } catch (Exception ignored) {}
        }
    }

    public synchronized void stop() {
        this.stopped = true;
        if (clip != null) {
            try {
                clip.stop();
                clip.close();
            } catch (Exception ignored) {}
        }
    }

    public synchronized boolean isStopped() {
        return stopped;
    }
}
