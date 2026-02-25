package com.dnet.sdd.common.attachfile.service;

import com.dnet.sdd.common.attachfile.config.FileStorageProperties;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class FileStorageService {

    private final FileStorageProperties properties;
    private final SimpleDateFormat sdf = new SimpleDateFormat("HHmmssddMMyyyy");

    public FileStorageService(FileStorageProperties properties) {
        this.properties = properties;
    }

    // ============================================================
    // Create necessary directories
    // ============================================================
    public File getEmpDirectory(String applicationType, String empId) {

        String baseUploadDir = properties.getBaseDir();
        String typeFolder = applicationType.toLowerCase().trim();

        File baseDir = new File(baseUploadDir);
        if (!baseDir.exists()) baseDir.mkdirs();

        File typeDir = new File(baseDir, typeFolder);
        if (!typeDir.exists()) typeDir.mkdirs();

        File empDir = new File(typeDir, empId);
        if (!empDir.exists()) empDir.mkdirs();

        return empDir;
    }

    // ============================================================
    // Clean file name
    // ============================================================
    private String cleanFileName(String original) {
        return StringUtils.cleanPath(Objects.requireNonNull(original))
                .replaceAll("\\s+", "_")
                .replaceAll("[^A-Za-z0-9._-]", "");
    }

    // ============================================================
    // Save uploaded files
    // ============================================================
    public List<String> saveNewFiles(MultipartFile[] files, File empDir) throws IOException {

        List<String> savedNames = new ArrayList<>();
        if (files == null) return savedNames;

        for (MultipartFile file : files) {
            if (file == null || file.isEmpty()) continue;

            String original = cleanFileName(file.getOriginalFilename());
            String timestamp = sdf.format(new Date());
            String finalName = timestamp + "_" + original;

            File dest = new File(empDir, finalName);
            file.transferTo(dest);

            savedNames.add(finalName);
        }

        return savedNames;
    }

    // ============================================================
    // Delete unused files
    // ============================================================
    public void deleteRemovedFiles(Set<String> retainedFiles, File empDir) {

        File[] allFiles = empDir.listFiles();
        if (allFiles == null) return;

        for (File file : allFiles) {
            if (!retainedFiles.contains(file.getName())) {
                file.delete();
            }
        }
    }

    public void deleteFilesByNames(File empDir, List<String> fileNames) {

        if (fileNames == null || fileNames.isEmpty()) return;

        for (String name : fileNames) {
            File f = new File(empDir, name);
            if (f.exists()) {
                f.delete();
            }
        }
    }

    public void deleteRemovedFilesForApplication(
            Set<String> previouslyLinked,
            Set<String> retained,
            File empDir) {

        if (previouslyLinked == null || previouslyLinked.isEmpty()) return;

        Set<String> toDelete = new HashSet<>(previouslyLinked);

        if (retained != null && !retained.isEmpty()) {
            toDelete.removeAll(retained);
        }

        for (String name : toDelete) {
            File f = new File(empDir, name);
            if (f.exists()) {
                f.delete();
            }
        }
    }

    // ============================================================
    // Merge retained + new
    // ============================================================
    public String mergeFileNames(Set<String> retained, List<String> newFiles) {
        retained.addAll(newFiles);
        return String.join(";", retained);
    }

    // ============================================================
    // Parse retained string
    // ============================================================
    public Set<String> parseRetainedFiles(String retainedFiles) {

        if (retainedFiles == null || retainedFiles.isBlank())
            return new HashSet<>();

        return new HashSet<>(Arrays.asList(retainedFiles.split(";")));
    }
}