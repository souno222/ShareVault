package in.sounodip.Cloudshare.controller;

import in.sounodip.Cloudshare.document.SavedFilesDocument;
import in.sounodip.Cloudshare.dto.SavedFilesDTO;
import in.sounodip.Cloudshare.service.SavedFilesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/saved-files")
@RequiredArgsConstructor
public class SavedFilesController {

    private final SavedFilesService savedFilesService;

    // Endpoint to save a file by its ID
    @PostMapping("/add/{fileid}")
    public ResponseEntity<SavedFilesDTO> saveFile(@PathVariable String fileid){
        SavedFilesDTO savedFile = savedFilesService.saveFile(fileid);
        return ResponseEntity.ok(savedFile);
    }

    //Endpoint to get list of saved files
    @GetMapping
    public ResponseEntity<List<SavedFilesDTO>> getSavedFiles(){
        List<SavedFilesDTO> savedFiles = savedFilesService.getSavedFiles();
        return ResponseEntity.ok(savedFilesService.getSavedFiles());
    }

    // Endpoint to remove a saved file by its ID
    @DeleteMapping("/remove/{savedFileId}")
    public ResponseEntity<Void> removeSavedFile(@PathVariable String savedFileId){
        System.out.println("Removing saved file with ID: " + savedFileId);
        savedFilesService.removeSavedFile(savedFileId);
        return ResponseEntity.noContent().build();
    }

    // Endpoint to check if a file is already saved by its ID
    @GetMapping("/is-saved/{fileId}")
    public ResponseEntity<Boolean> isFileSaved(@PathVariable String fileId){
        boolean isSaved = savedFilesService.isFileSaved(fileId);
        return ResponseEntity.ok(isSaved);
    }

}
