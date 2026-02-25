package com.dnet.sdd.common.attachfile.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "uploads")
public class FileStorageProperties {

    /**
     * Base directory where all uploads are stored
     */
    private String baseDir;

    public String getBaseDir() {
        return baseDir;
    }

    public void setBaseDir(String baseDir) {
        this.baseDir = baseDir;
    }
}
