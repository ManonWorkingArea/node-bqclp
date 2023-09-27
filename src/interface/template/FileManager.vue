<script>

// Plugin
import CreateFolder   from '@/interface/modal/CreateFolder.vue';
import RenameFolder   from '@/interface/modal/RenameFolder.vue';
import {useRoute} 	  from 'vue-router'
import { S3 }         from "@aws-sdk/client-s3";
import Plyr           from "plyr";
import { ListObjectsCommand,PutObjectCommand,DeleteObjectCommand,CopyObjectCommand } from "@aws-sdk/client-s3";

import storageManager from '@/plugins/storage';

import { Image } from 'image-js';
import { reactive } from 'vue';

import convertUtils from "@/plugins/convertUtils";

export default {
    emits: ["select-file-trigger"],
    props: { Mode: String, AllowFile: Array , CallbackFunc: String,},
    data() {
      const session 		    = storageManager.get('session');
      const schoolSession   = session.current;
      const route           = useRoute();
      const s3Client        = new S3({
          forcePathStyle:false,
          endpoint : schoolSession.s3EndpointDefault,
          region : schoolSession.s3Region,
          ResponseContentEncoding:"utf-8",
          credentials: {
            accessKeyId : schoolSession.s3Key,
            secretAccessKey : schoolSession.s3Secret
          }
      });

      return {
        searchQuery: '',
        files: reactive([]),
        fileList:[],
        folderPath:"",
        prefix:"",
        objCount:"",
        S3:s3Client,
        PageName:route.meta.title,
        PageIcon:route.meta.icon,
        showModal:false,
        activeBlock:false,
        createFolderModal:false,
        RenameFolderModal:false,
        showFileDetail:false,
        showFilePreview:false,
        uploadPanel:false,
        renameTriggerObj:"",
        renameTriggerId:"",
        oldname:"",
        viewFilename:"",
        viewFilesize:"",
        viewFilecover:"",
        viewFilecreate:"",
        viewFileurl:"",
        viewFileDuration:'',
        viewFileThumbnail:'',
        modalContent: "",
        selectFile:undefined,
        schoolSession:schoolSession,
        session: storageManager.get('session'),
        configs: storageManager.get('configs'),
        limitOptions: [1,10, 50, 100, 200, 500, 1000, 2000, 3000, 4000], // Define the available options
        totalPages: 0,
        totalItems: 0,

        dragging: false,
        draggedItem: "",
        dropTarget: "",
        selectItem:'',
        selectItemData:'',
        hasSelected:false,

        fileListing:[],
        summaryFileSize:0,
        space:5000,

        capturedThumbnail: null,

        limitItem:50,
        currentPage: 1,
        debounceTimer: null,
        error:false,
        errorText:'',

        // Image Resize Option
        isResizeModalOpen: false,
        selectedFileType: 'image/webp', // Default file type
        selectedQuality: 0.8,           // Default quality
        selectedResizeItem:'',
        selectedResizeId:'',
        replaceExistingFile:false
      }
    },
    components: {
      CreateFolder,
      RenameFolder,
    },
    methods: {
      formatDuration(duration) {
        const totalSeconds = parseFloat(duration);
        if (isNaN(totalSeconds) || totalSeconds <= 0) {
          return '00:00';
        }

        const minutes = Math.floor(totalSeconds / 60);
        const seconds = Math.floor(totalSeconds % 60);

        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedSeconds = seconds.toString().padStart(2, '0');

        return `${formattedMinutes}:${formattedSeconds}`;
      },
      handleDragStart(itemTitle) {
        this.dragging = true;
        this.draggedItem = itemTitle;
        //console.log("Dragging started:", this.draggedItem);
      },
      handleDragEnd() {
        this.dragging = false;
        this.draggedItem = "";
      },
      getFileType(mimetype) {
        return convertUtils.getFileType(mimetype, "short");
      },
      getNewFileExtension(fileName) {
        // Logic to extract and return the file extension
        // For example, you can split the fileName by '.' and return the last part
        const parts = fileName.split('.');
        return parts.length > 1 ? parts[parts.length - 1] : 'default';
      },
      calculateDiskUsagePercentage(bytes) {
        const limitInBytes = this.space * 1024 * 1024; // 5000MB in bytes
        const percentage = (bytes / limitInBytes) * 100;
        return percentage.toFixed(2); // Display percentage with two decimal places
      },
      async handleDrop(targetTitle) {
        try {
          // Set the drop target
          this.dropTarget = targetTitle;
          //console.log("Dropped on:", this.dropTarget);

          // Assuming moveFile returns a promise
          await this.moveFile(this.draggedItem, this.dropTarget);

          // Perform any other necessary actions when an item is dropped
        } catch (error) {
          console.error("Error handling drop:", error);
          // Handle the error as needed
        }
      },
      getFileName(fileName) {
        const lastDotIndex = fileName.lastIndexOf('.');
        return lastDotIndex === -1 ? fileName : fileName.substring(0, lastDotIndex);
      },
      getFileExtension(fileName) {
        const lastDotIndex = fileName.lastIndexOf('.');
        return lastDotIndex === -1 ? '' : fileName.substring(lastDotIndex);
      },
      async resizeImageAndReplace(originalPath) {
        try {
          const imageUrl = this.schoolSession.s3Endpoint + originalPath;
          // Load the original image using image-js
          const originalImage = await Image.load(imageUrl);
          // Create a new key for the original image in the "folder_original" path
          const originalPathArray = originalPath.split("/");
          const originalFileName = originalPathArray.pop();
          const folderOriginalKey =
            originalPathArray.join("/") + "/folder_original/" + originalFileName;
          // Move the original image to "folder_original"
          const copyData = await this.S3.send(new CopyObjectCommand({
            Bucket: this.schoolSession.s3Bucket,
            CopySource: this.schoolSession.s3Bucket + "/" + originalPath,
            Key: folderOriginalKey,
            ACL: "public-read", // Set the appropriate ACL
          }));
          console.log("Moved original image to folder_original:", copyData);
          // Resize the original image
          const resizedImage = originalImage.resize({
            width: 1980, // Set the desired width for the resized image
          });
          // Convert the resized image to Blob format with increased quality
          const resizedImageBlob = await resizedImage.toBlob("image/png", 1); // Use PNG format for lossless quality
          // Upload the resized image to replace the original image's place
          const resizedImageKey = originalPath;
          const resizeData = await this.S3.send(new PutObjectCommand({
            Bucket: this.schoolSession.s3Bucket,
            Key: resizedImageKey,
            Body: resizedImageBlob,
            ACL: "public-read", // Set the appropriate ACL
          }));
          console.log("Resized and replaced image:", resizeData);
          // Refresh the file browser after updating the image
          this.listFile();
        } catch (error) {
          console.log("Error resizing and replacing image:", error);
        }
      },
      async resizeOption(path,id) {
        this.isResizeModalOpen = true;
        this.selectedResizeItem = path
        this.selectedResizeId = id
      },
      async saveOptions() {
        await this.replaceImageWithResized();
      },
      async replaceImageWithResized() {
        try {
          let originalPath =this.selectedResizeItem
          let id = this.selectedResizeId
          const imageUrl = this.schoolSession.s3Endpoint + originalPath;
          const originalImage = await Image.load(imageUrl);

          const targetWidth = 1920;
          const targetHeight = Math.round((targetWidth / originalImage.width) * originalImage.height);

          if (
            originalImage.width <= targetWidth &&
            originalImage.height <= targetHeight
          ) {
            console.log("Image is already 4K or smaller. Skipping resize.");
            return;
          }

          const resizedImage = originalImage.resize({
            width: targetWidth,
            height: targetHeight,
            fit: 'fill',
            position: 'center',
            kernel: 'lanczos3',
          });

          const resizedImageBlob  = await resizedImage.toBlob(this.selectedFileType, this.selectedQuality);
          const newSizeBytes      = resizedImageBlob.size;
          const replaceData       = await this.S3.send(new PutObjectCommand({
            Bucket: this.schoolSession.s3Bucket,
            Key: originalPath,
            Body: resizedImageBlob,
            ACL: 'public-read',
          }));

          console.log("Resized and replaced image:", replaceData, originalPath);
          console.log("newSizeBytes:", newSizeBytes);

          await this.resizeFile(id, newSizeBytes);
          this.isResizeModalOpen = false;
          this.listFile();
        } catch (error) {
          console.log("Error resizing and replacing image:", error);
        }
      },
      async createThumbnail(originalPath, id) {
        try {
          const imageUrl      = originalPath;
          const originalImage = await Image.load(imageUrl);
          // Resize the original image to a width of 200 pixels
          const resizedImage  = originalImage.resize({
            width: 200,
          });
          // Convert the resized image to Blob with 20% quality (0.2)
          const resizedImageBlob = await resizedImage.toBlob('image/jpeg', 0.2);
          // Convert the Blob to Base64
          const resizedImageBase64 = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              resolve(reader.result);
            };
            reader.readAsDataURL(resizedImageBlob);
          });
          // Assuming this.thumbnailFile is an asynchronous function, await it here
          await this.thumbnailFile(id, resizedImageBase64);
          return resizedImageBase64;
        } catch (error) {
          console.log("Error resizing image:", error);
          return null; // Return null or handle the error as needed
        }
      },
      async captureThumbnail(videoUrl, id) {
        try {
          const video = document.createElement('video');
          video.src = videoUrl;
          video.crossOrigin = 'anonymous'; // Set crossorigin attribute
          await video.load();
          video.width = 640;
          video.height = 360;

          const canvas = document.createElement('canvas');
          canvas.width = video.width;
          canvas.height = video.height;
          const ctx = canvas.getContext('2d');
          await new Promise((resolve) => {
            video.addEventListener('canplay', resolve);
          });
          video.play();

          // Get video duration
          const videoDuration = video.duration;
          
          // Wait for the video to play for a certain duration (5 seconds in this case)
          await new Promise((resolve) => setTimeout(resolve, 5000));
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          video.pause();
          const thumbnailDataUrl = canvas.toDataURL('image/jpeg');
          this.capturedThumbnail = thumbnailDataUrl;

          // Now you have both the thumbnail and video duration
          console.log('Thumbnail Data URL:', thumbnailDataUrl);
          console.log('Video Duration:', videoDuration);

          // You can call your thumbnailFile function here with the video duration
          await this.thumbnailFile(id, thumbnailDataUrl, videoDuration);
        } catch (error) {
          console.log('Error capturing thumbnail:', error);
        }
      },
      async restoreOriginalImage(resizedImageUrl) {
        try {
          // Extract the original image path from the resized image URL
          const originalPath = resizedImageUrl.replace(this.schoolSession.s3Endpoint, '');
          // Create the key for the original image in the "folder_original" path
          const originalPathArray = originalPath.split('/');
          const originalFileName = originalPathArray.pop();
          const originalKey = originalPathArray.join('/') + '/folder_original/' + originalFileName;
          // Copy the original image from "folder_original" to its original location
          const copyData = await this.S3.send(new CopyObjectCommand({
            Bucket: this.schoolSession.s3Bucket,
            CopySource: this.schoolSession.s3Bucket + '/' + originalKey,
            Key: originalPath,
            ACL: 'public-read', // Set the appropriate ACL
          }));
          console.log('Restored original image:', copyData);
          // Delete the original image from "folder_original"
          const deleteData = await this.S3.send(new DeleteObjectCommand({
            Bucket: this.schoolSession.s3Bucket,
            Key: originalKey,
          }));
          console.log('Deleted original image from folder_original:', deleteData);
          // Refresh the file browser after restoring the original image
          this.listFile();
        } catch (error) {
          console.log('Error restoring original image:', error);
        }
      },
      isAllowedFile(filename) {
        const ext = filename.split('.').pop().toLowerCase();
        return this.AllowFile.includes(ext);
      },
      videoStreaming() {
        const _self     = this
        var url         = _self.videoContent;
        const video     = this.$refs.videoStreaming;

        let extension   = url.split(".").pop();
        console.log("tage url", url);
        console.log("tage video", video);
        console.log("extension video", extension);
        const defaultOptions = {};

          const player = new Plyr(video, defaultOptions);
          player.on('timeupdate', (event) => {
            const instance = event.detail.plyr;
            console.log(instance);
          });
      },
      formatDate(dateString) {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('default', {dateStyle: 'long'}).format(date);
      },
      onDoubleClick(filename) {
        // Find the item in this.fileListing with the matching name
        const selectedItem = this.fileListing.find(item => item.name === filename);

        if (!selectedItem) {
          console.log(`Item with name '${filename}' not found.`);
          return;
        }

        //console.log("filename", filename + "/" + selectedItem);
        
        if (selectedItem.type === 'folder') {
          // Handle folder double-click
          // You can add your folder-specific logic here
          console.log("Folder double-clicked:", selectedItem);
        } else {
          // Handle file double-click
          const filetype = selectedItem.name.split('.').pop();
          this.viewFilesize = selectedItem.size;
          this.viewFilename = selectedItem.name;
          this.viewFilecover = selectedItem.cover;
          this.viewFilecreate = selectedItem.create;
          this.viewFileurl = selectedItem.path;
          this.viewFileDuration = selectedItem.duration;
          this.viewFileThumbnail = selectedItem.thumbnail;
          this.viewFileextension = filetype;
          //console.log("filetype", filetype);

          //console.log("filename", this.viewFileurl);
          const fileExtension = this.viewFileurl.split('.').pop();
          //console.log("fileExtension", fileExtension);
          if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
            this.selectedFile = this.viewFileurl;
            this.modalContent = "image";
            this.showModal = true;
          } else if (['mp4', 'ogg', 'webm'].includes(fileExtension)) {
            this.selectedFile = this.viewFileurl;
            this.modalContent = "video";
            this.showModal = true;
          }
          else
          {
            this.error = true;
            this.errorText = 'ไม่ได้สามารถแสดงตัวอย่างไฟล์ประเภทนี้ได้';
          }
        }
      },
      isImage(src) {
        return src.match(/\.(jpeg|jpg|gif|png)$/) != null;
      },
      async listFile() {
        try {
          const session     = storageManager.get('session');

          this.fileList     = [];
          this.prefix       = session.prefix;
          //this.activeBlock  = true;
          let andConditions = [
            this.session.current._id ? { owner: this.session.current._id, parent: this.prefix } : { owner: this.configs.siteID, parent: this.prefix }
          ];
          const pipeline = [
            {
              $match: {
                $and: andConditions,
              },
            },
            {
              $facet: {
                totalCount: [
                  { $count: "count" },
                ],
                folders: [
                  {
                    $match: {
                      mimetype: "folder",
                    },
                  },
                  {
                    $lookup: {
                      from: "storage",
                      let: { folderPath: "$path" },
                      pipeline: [
                        {
                          $match: {
                            $expr: {
                              $and: [
                                {
                                  $or: [
                                    { $eq: ["$parent", "$$folderPath"] },
                                    { $regexMatch: { input: "$parent", regex: { $concat: ["^", "$$folderPath"] }, options: "" } },
                                  ],
                                },
                                this.session.current._id ? { owner: this.session.current._id } : {},
                              ],
                            },
                          },
                        },
                      ],
                      as: "filesInFolder",
                    },
                  },
                  {
                    $project: {
                      _id: 1,
                      original: 1,
                      path: 1,
                      name: 1,
                      type: 1,
                      duration: 1,
                      mimetype: 1,
                      spaceId: 1,
                      thumbnail: 1,
                      createdAt: 1,
                      count: { $size: "$filesInFolder" },
                      size: {
                        $sum: {
                          $map: {
                            input: "$filesInFolder",
                            as: "file",
                            in: { $ifNull: ["$$file.size", 0] },
                          },
                        },
                      },
                    },
                  },
                ],
                files: [
                  {
                    $match: {
                      mimetype: { $ne: "folder" }, // Exclude folders
                    },
                  },
                  {
                    $project: {
                      _id: 1,
                      original: 1,
                      path: 1,
                      name: 1,
                      type: 1,
                      duration: 1,
                      mimetype: 1,
                      thumbnail: 1,
                      spaceId: 1,
                      createdAt: 1,
                      size: { $ifNull: ["$size", 0] },
                    },
                  },
                ],
              },
            },
          ];

          const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              pipeline: pipeline,
            }),
          };

          const resAPI = await fetch('https://multisource-api-edsdv.ondigitalocean.app/api/DU1eYMDG7j8yb199YDPg2/storage/aggregate', requestOptions);
          const restReturn = await resAPI.json();

          // Extract folders and files from the pipeline result
          const folders = restReturn[0].folders;
          const files   = restReturn[0].files;

          // Sort folders and files naturally
          folders.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));
          files.sort((a, b)   => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));

          // Concatenate folders and files while keeping the order (folders first)
          this.fileListing = folders.concat(files);

          this.folderPath = this.prefix;

          if(this.folderPath!="" && this.folderPath!=undefined) {
            this.folderPath = this.folderPath.split("/");
          } else {
            this.folderPath = "";
          }

          const size = await this.usageSpace();
          this.summaryFileSize = size
          this.unselectItem()
          //this.activeBlock = false;
        } catch (error) {
          console.log(error);
        }
      },
      async usageSpace() {
        try {
          const pipeline = [
            {
              $match: {
                owner: this.session.current._id || this.configs.siteID,
              },
            },
            {
              $group: {
                _id: null,
                totalSize: { $sum: "$size" }, // Replace "size" with the actual field name containing the size
              },
            },
          ];

          const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              pipeline: pipeline,
            }),
          };

          const resAPI = await fetch('https://multisource-api-edsdv.ondigitalocean.app/api/DU1eYMDG7j8yb199YDPg2/storage/aggregate', requestOptions);
          const restReturn = await resAPI.json();

          return restReturn[0].totalSize
          
        } catch (error) {
          console.log(error);
        }
      },
      async addFile(file) {
        try {
          //this.activeBlock = true;
          const resAPI = await fetch("https://multisource-api-edsdv.ondigitalocean.app/api/DU1eYMDG7j8yb199YDPg2/storage/", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              data: {
                owner: this.session.current._id || this.configs.siteID,
                original: file.original,
                path: file.path,
                parent: this.prefix,
                name: file.name,
                size: file.size,
                type: file.mimetype,
                mimetype: file.type,
                spaceId: this.session.current.spaceId || this.configs.spaceId,
              },
              options: {}
            })
          });
          const finalRes   = await resAPI.json();
          //console.log(finalRes);
          return finalRes
        } catch (error) {
          console.log(error)
        }
      },
      async assignSpace(file) {
        try {
            const callApi = await fetch("https://multisource-api-edsdv.ondigitalocean.app/api/DU1eYMDG7j8yb199YDPg2/storage/" + file, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  data: {
                    "spaceId": this.session.current.spaceId || this.configs.spaceId,
                  },
                  options: {}
                })
            });
            await callApi.json();
            if (callApi.status===200) {
              await this.listFile();
            }
        } catch (error) {
            console.log(error)
        }
      },
      async renameFile(file,name) {
        try {
            const callApi = await fetch("https://multisource-api-edsdv.ondigitalocean.app/api/DU1eYMDG7j8yb199YDPg2/storage/" + file, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  data: {
                    "name": name,
                  },
                  options: {}
                })
            });
            await callApi.json();
            if (callApi.status===200) {
              await this.listFile();
            }
        } catch (error) {
            console.log(error)
        }
      },
      async resizeFile(file,size) {
        try {
            const callApi = await fetch("https://multisource-api-edsdv.ondigitalocean.app/api/DU1eYMDG7j8yb199YDPg2/storage/" + file, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  data: {
                    "size": size,
                  },
                  options: {}
                })
            });
            await callApi.json();
            if (callApi.status===200) {
              await this.listFile();
            }
        } catch (error) {
            console.log(error)
        }
      },
      async thumbnailFile(file,thumbnail,duration) {
        try {
            const callApi = await fetch("https://multisource-api-edsdv.ondigitalocean.app/api/DU1eYMDG7j8yb199YDPg2/storage/" + file, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  data: {
                    "thumbnail": thumbnail,
                    "duration": duration,
                  },
                  options: {}
                })
            });
            await callApi.json();
            if (callApi.status===200) {
              await this.listFile();
            }
        } catch (error) {
            console.log(error)
        }
      },
      async moveFile(file,parent) {
        try {
            const callApi = await fetch("https://multisource-api-edsdv.ondigitalocean.app/api/DU1eYMDG7j8yb199YDPg2/storage/" + file, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  data: {
                    "parent": parent,
                  },
                  options: {}
                })
            });
            await callApi.json();
            if (callApi.status===200) {
              await this.listFile();
            }
        } catch (error) {
            console.log(error)
        }
      },
      async deleteDocument(id) {
        try {
          console.log("id",id)
          await fetch("https://multisource-api-edsdv.ondigitalocean.app/api/DU1eYMDG7j8yb199YDPg2/storage/" + id, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
          });
          //console.log(resAPI);
          await this.listFile();
        } catch (error) {
          console.log(error)
        }
      },
      async renderFileBrowser() {
        if(storageManager.get('session','login')) {
          try {
            const session 		  = storageManager.get('session');
            let rawFile         = [];
            this.rawfileList    = "";
            this.fileList       = [];
            this.prefix         = session.prefix;
            //this.activeBlock    = true;

            await this.listFile();

            const data = await this.S3.send(new ListObjectsCommand({Bucket: this.schoolSession.s3Bucket, Prefix:this.prefix}));
            console.log("Success", data.Contents);
            if(data.Contents!=undefined && data.Contents!=null && data.Contents!="")
            {
              for (let i = 0; i < data.Contents.length; i++) {
                rawFile.push(data.Contents[i].Key);
              }

              this.rawfileList  = rawFile.join();
              this.objCount     = data.Contents.length;

              //console.log("RAW",this.rawfileList);
              for (let i = 0; i < data.Contents.length; i++) {
                let contentObj;
                let contentSize;
                let contentCreate
                if(this.prefix!="" && this.prefix!=undefined) {
                  contentObj    = data.Contents[i].Key.replace(this.prefix + "/", '');
                } else {
                  contentObj    = data.Contents[i].Key;
                }

                contentSize     = data.Contents[i].Size;
                contentCreate   = data.Contents[i].LastModified;

                //console.log("contentObj",contentObj);
                if(contentObj.includes('/')) {
                  var res = contentObj.split("/");
                  const arrFiltered = res.filter(el => {
                    return el != null && el != '';
                  });
                  //console.log("length",arrFiltered.length);
                  //console.log("contentObj",contentObj);
                  if(arrFiltered.length==1)
                  {
                    if(this.prefix!="" && this.prefix!=undefined) {
                      this.fileList.push({
                        title: contentObj.replace("/", ''),
                        prefix:this.prefix+'/'+contentObj.replace("/", ''),
                        count:this.countInnerObj(this.rawfileList,contentObj),
                        size:contentSize,
                        create:contentCreate,
                        isFolder:  true
                      });
                    } else {
                      this.fileList.push({
                        title: contentObj.replace("/", ''),
                        prefix: contentObj.replace("/", ''),
                        count:this.countInnerObj(this.rawfileList,contentObj),
                        size:contentSize,
                        create:contentCreate,
                        isFolder:  true
                      });
                    }
                  }
                } else {
                  if(contentObj.trim().length)
                  {
                    let fileGroup;
                    let fileCover;
                    let fileIcon;
                    let filetype = contentObj.replace("/", '').substring(contentObj.replace("/", '').lastIndexOf(".")+1);
                    if(
                    filetype  == "jpg" || 
                    filetype  == "jpeg" || 
                    filetype  == "JPG" || 
                    filetype  == "JPEG" ||
                    filetype  == "png" || 
                    filetype  == "PNG" || 
                    filetype  == "gif" || 
                    filetype  == "GIF"
                    ) {
                      fileGroup = "image";
                      fileIcon = "";
                      if(this.prefix!="" && this.prefix!=undefined) {
                        fileCover = this.schoolSession.s3Endpoint + this.prefix + "/" + contentObj.replace("/", '');
                      }
                      else {
                        fileCover = this.schoolSession.s3Endpoint + contentObj.replace("/", '');
                      }
                    } else if(
                    filetype  == "mp4" || 
                    filetype  == "doc" || 
                    filetype  == "xls" ||
                    filetype  == "pdf"
                    ) {
                      if(filetype  == "doc") {
                        fileIcon = "file-word";
                      }
                      if(filetype  == "xls") {
                        fileIcon = "file-spreadsheet";
                      }
                      if(filetype  == "pdf") {
                        fileIcon = "file-pdf";
                      }
                      if(filetype  == "mp4") {
                        fileIcon = "file-video";
                      }
                      fileGroup = "document";
                      fileCover = "";
                    }
                    else
                    {
                      fileGroup = "document";
                      fileCover = "";
                      fileIcon = "file";
                    }

                    if(this.prefix!="" && this.prefix!=undefined) {
                      this.fileList.push({
                        title: contentObj.replace("/", ''),
                        prefix:this.prefix+'/'+contentObj.replace("/", ''),
                        size:contentSize,
                        type:fileGroup,
                        cover:fileCover,
                        icon:fileIcon,
                        create:contentCreate,
                        isFolder:  false
                      });
                    } else {
                      this.fileList.push({
                        title: contentObj.replace("/", ''),
                        prefix: contentObj.replace("/", ''),
                        type:fileGroup,
                        icon:fileIcon,
                        cover:fileCover,
                        size:contentSize,
                        create:contentCreate,
                        isFolder:  false
                      });
                    }
                  }
                }
              }

              this.fileList.sort(function(a,b){
                const titleA = parseInt(a.title, 10);
                const titleB = parseInt(b.title, 10);
                return (b.isFolder - a.isFolder) || (titleA - titleB);
              });
              
              this.folderPath = this.prefix;

              if(this.folderPath!="" && this.folderPath!=undefined) {
                this.folderPath = this.folderPath.split("/");
              } else {
                this.folderPath = "";
              }

              console.log("File List",this.fileList);
              console.log("Folder Path",this.folderPath);
              console.log("Object Count",this.objCount);

              //this.activeBlock = false;
            } else {
              //this.activeBlock = false;
            }
          } catch (err) {
            console.log("Error", err);
          }
        }
      },
      unselectItem() {
        this.selectItem     = ''
        this.selectItemData = ''
        this.hasSelected    = false
      },
      openViewFile(item) {
        var index = this.fileListing.findIndex(p => p.name == item);

        //console.log("item",item + "/" + index);
        //console.log(this.fileListing[index]);

        this.selectItem       = this.fileListing[index]._id
        this.selectItemData   = this.fileListing[index]
        this.hasSelected      = true

        /*
        let filetype = this.fileList[index]['title'].replace("/", '').substring(this.fileList[index]['title'].replace("/", '').lastIndexOf(".")+1);
        this.viewFilesize       = this.fileList[index]['size']
        this.viewFilename       = this.fileList[index]['title']
        this.viewFilecover      = this.fileList[index]['cover']
        this.viewFilecreate     = this.fileList[index]['create']
        this.viewFileurl        = this.fileList[index]['prefix']
        this.viewFileextension  = filetype
        console.log("filetype",filetype);
        this.showFileDetail     = true;
        
        if(filetype==='mp4') {
          this.showFilePreview = false;
        }else { 
          this.showFilePreview = true;
        }
        */
      },
      openFolder(folder) {
        const new_prefix = folder && folder.trim() !== '' ? folder.trim() : '';
        const session = {
            prefix: new_prefix,
        };
        storageManager.update('session',session)
        this.listFile();
      },
      closeViewFile() {
        this.showFileDetail = false;
      },
      countInnerObj(string, word) {
        return string.split(word).length - 1;
      },
      formatBytes(bytes) {
          var marker = 1024; // Change to 1000 if required
          var decimal = 3; // Change as required
          var kiloBytes = marker; // One Kilobyte is 1024 bytes
          var megaBytes = marker * marker; // One MB is 1024 KB
          var gigaBytes = marker * marker * marker; // One GB is 1024 MB
          if(bytes < kiloBytes) return bytes + " Bytes";
          else if(bytes < megaBytes) return(bytes / kiloBytes).toFixed(decimal) + " KB";
          else if(bytes < gigaBytes) return(bytes / megaBytes).toFixed(decimal) + " MB";
          else return(bytes / gigaBytes).toFixed(decimal) + " GB";
      },
      // Create Folder Function
      //
      openCreateFolder() {
        this.createFolderModal = true;
      },
      createFolderTrigger(payload) {
        this.createFolderModal = payload;
      },
      async createFolder(payload) {

        const folderNameToCreate = payload.foldername;
        // Check if the folder name already exists in the fileListing array
        const folderAlreadyExists = this.fileListing.some(item => {
          return item.mimetype === 'folder' && item.name === folderNameToCreate;
        });

        if (folderAlreadyExists) {
          // Handle the case where the folder name already exists
          this.error = true;
          this.errorText = `มีโฟลเดรอ์ '${folderNameToCreate}' ในระบบแล้ว.`;
          return; // Exit the function
        }

        //let filename;
        let folderpath;
        if(this.folderPath!="" && this.folderPath!=undefined) {
          //filename = this.prefix + "/" + payload.foldername + "/";
          folderpath = this.prefix + "/" + payload.foldername;
        } else {
          //filename = payload.foldername + "/";
          folderpath = payload.foldername;
        }
        //const data = await this.S3.send(new PutObjectCommand({Bucket: this.schoolSession.s3Bucket, Key:filename}));
        //console.log("Success", data);

        await this.addFile({  parent: this.prefix, path: folderpath, name: payload.foldername, size: null, type: 'folder' });
        this.createFolderModal = false;

        this.listFile()
      },
      async countFolder(payload) {
        try {
          const data = await this.S3.send(new ListObjectsCommand({Bucket: this.schoolSession.s3Bucket, Prefix:payload}));
          console.log("Success", data);
          return data.Contents.length;
        } catch (error) {
          console.log(Error);
        }
      },
      // Rename Folder Function
      //
      openRenameFolder(item,old,id) {
        this.renameTriggerObj = item;
        this.renameTriggerId = id
        this.oldname = old;
        let oldNameArray = old.split(".");
        if (oldNameArray.length > 1) {
          oldNameArray.pop();
        }
        this.oldname = oldNameArray.join("");
        this.RenameFolderModal = true;
      },
      RenameFolderTrigger(payload) {
        this.RenameFolderModal = payload;
      },
      async RenameFolder(payload) {

        //console.log("payload",payload);
        // Extract the file extension from originalname (if it exists)
        const originalNameParts = payload.originalname.split('.');
        let folderNameWithExtension = payload.foldername;
        
        if (originalNameParts.length > 1) {
          // If originalname has an extension, append it to foldername
          folderNameWithExtension += '.' + originalNameParts.pop();
        }

        // Rename the folder using folderNameWithExtension
        await this.renameFile(payload.originalid, folderNameWithExtension);
        /*
        let newName;
        let original;
        let originalSource;
        let newPath;

        let originalNameArray = payload.originalname.split(".");

        let checkContent;
        if (originalNameArray.length > 1) {
          checkContent = "file";
        } else {
          checkContent = "folder";
        }

        if (this.prefix !== "" && this.prefix !== undefined) {
          newName = this.prefix + "/" + (checkContent === "file" ? payload.foldername + "." + originalNameArray[originalNameArray.length - 1] : payload.foldername + "/");
          newPath = this.prefix + "/" + (checkContent === "file" ? payload.foldername + "." + originalNameArray[originalNameArray.length - 1] : payload.foldername + "/");
        } else {
          newName = (checkContent === "file" ? payload.foldername + "." + originalNameArray[originalNameArray.length - 1] : payload.foldername + "/");
          newPath = (checkContent === "file" ? payload.foldername + "." + originalNameArray[originalNameArray.length - 1] : payload.foldername + "/");
        }

        if (checkContent === "file") {
          original        = this.schoolSession.s3Bucket + "/" + payload.originalname;
          originalSource  = payload.originalname;
        } else {
          original        = this.schoolSession.s3Bucket + "/" + payload.originalname + "/";
          originalSource  = payload.originalname + "/";
        }

        const data2 = await this.S3.send(new ListObjectsCommand({Bucket: this.schoolSession.s3Bucket, Prefix:originalSource}));
        const data  = await this.S3.send(new CopyObjectCommand({Bucket: this.schoolSession.s3Bucket, Key: newName, CopySource: original, ACL: 'public-read'}));
        console.log("Success", data);

        if (checkContent === "folder") {
          const originalCountObj = data2.Contents.length
          console.log("Count",originalCountObj);

          if(originalCountObj>1) {
            console.log("Just Delete");
            for (let i = 0; i < data2.Contents.length; i++) {
              if(data2.Contents[i].Key!=originalSource){
                  let original    = newPath + data2.Contents[i].Key.replace(originalSource, '');
                  let source      = this.schoolSession.s3Bucket + "/" + data2.Contents[i].Key;
                  const data3     = await this.S3.send(new CopyObjectCommand({Bucket: this.schoolSession.s3Bucket, Key:original, CopySource:source, ACL:'public-read', ContentType:"text/html;charset=utf-8"}));
                  console.error("Move", data3);
                  const data4 = await this.S3.send(new DeleteObjectCommand({Bucket: this.schoolSession.s3Bucket, Key:data2.Contents[i].Key}));
                  console.error("Delete", data4);
              }
            }
          }
          else {
            console.log("Non Delete");
          }
        }
        
        const data4 = await this.S3.send(new DeleteObjectCommand({Bucket: this.schoolSession.s3Bucket, Key:originalSource}));
        console.log("Success", data4);

        */

        this.RenameFolderModal = false;
        await this.listFile();
      },
      stringToBytes(text) {
        const length = text.length;
        const result = new Uint8Array(length);
        for (let i = 0; i < length; i++) {
          const code = text.charCodeAt(i);
          const byte = code > 255 ? 32 : code;
          result[i] = byte;
        }
        return result;
      },
      async deleteFolder(payload, id, count) {
        if (count > 0) {
          this.error = true;
          this.errorText = 'ไม่สามารถลบโฟลเดอร์ที่มีไฟล์ภายในได้';
          return;
        }

        try {
          await this.deleteDocument(id);
          //console.log('Success', payload);
        } catch (error) {
          console.log('Error:', error);
        }
      },
      async deleteFile(payload,id,file) {
        try {
          console.log("file",file);
          await this.S3.send(new DeleteObjectCommand({Bucket: this.schoolSession.s3Bucket, Key:file}));
          //console.log("Success", data, payload);
          await this.deleteDocument(id);
          this.listFile();
          this.closeViewFile();
          this.showModal = false;
        } catch (error) {
          console.log(Error);
        }
      },
      getFullPath(find) {
        var index = this.folderPath.indexOf(find);
        if(index=="0") {
          return find;
        } else {
          return this.folderPath.slice(0, index).join('/') + "/" + find;
        }
      },
      // Upload File
      //
      openUploadBox() {
        this.uploadPanel = true;
      },
      closeUploadBox() {
        this.uploadPanel = false;
        this.files = [];
      },
      addFiles() {
        this.$refs.files.click();
      },
      slugify(str) {
          str = str.replace(/^\s+|\s+$/g, ''); // trim
          str = str.toLowerCase();
          // remove accents, swap ñ for n, etc
          var from = "àáãäâèéëêìíïîòóöôùúüûñç·/_,:;";
          var to   = "aaaaaeeeeiiiioooouuuunc------";
          for (var i=0, l=from.length ; i<l ; i++) {
              str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
          }
          str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
              .replace(/\s+/g, '-') // collapse whitespace and replace by -
              .replace(/-+/g, '-'); // collapse dashes
          return str;
      },
      async submitFiles() {
        const currentDate = new Date();
        const year = currentDate.getFullYear().toString();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 because months are 0-based

        for (let i = 0; i < this.files.length; i++) {
          const file = this.files[i];
          const file_name_array = file.name.split('.');
          const file_extension = file_name_array.pop();
          //const file_name = this.slugify(file_name_array.join('.'));
          // Get the current timestamp
          const timestamp     = new Date().getTime();
          // Use the timestamp as the file name
          const new_file_name = String(timestamp);
          const path          = `${year}/${month}/`;
          file.status         = 'uploading';

          this.$forceUpdate();

          try {
            const data = await this.S3.send(new PutObjectCommand({
              Bucket: this.schoolSession.s3Bucket,
              Key: `${path}${new_file_name}.${file_extension}`,
              Body: file,
              ACL: 'public-read'
            }));

            file.status = 'success';
            console.log("Success", data);
            //console.log("file", file);
            file.original = `${path}${new_file_name}.${file_extension}`;

            const { name, size, type, original } = file;
            const filePath = `${this.schoolSession.s3Endpoint}${path}${new_file_name}.${file_extension}`;

            //console.log("Raw Type",type);
            const mimetype    = this.getFileType(type);
            //console.log("New Type",mimetype);

            const returnItem = await this.addFile({ path: filePath, name, size, type, original, mimetype });

            console.log("returnItem",returnItem);
            if(mimetype==='image') {
              //console.log("Image Convert");
              await this.createThumbnail(filePath, returnItem._id);
            }
            
            if(mimetype==='media'){
              //console.log("Media Convert");
              await this.captureThumbnail(filePath, returnItem._id);
            }

            this.$forceUpdate();
            
          } catch (error) {
            console.error(error);
            file.status = 'error';
          }

          console.log(i + 1 + ":" + this.files.length);

          if (i === this.files.length - 1) {
            this.listFile();
          }
        }
      },
      handleFilesUpload() {
        let uploadedFiles = this.$refs.files.files;
        for (var i = 0; i < uploadedFiles.length; i++) {
          uploadedFiles[i].status = 'pending';
          this.files.push(uploadedFiles[i]);
          //console.log('Uploaded file name:', uploadedFiles[i].name);
        }
        console.log(this.files);
      },

      removeFile( key ) {
        this.files.splice( key, 1 );
      },
      selectFileFunc(obj, duration, thumbnail) {
        //const endpoint = this.schoolSession.s3Endpoint;

        // Use obj.path if it exists and is not empty, otherwise use obj itself
        let filePath = obj.path ? obj.path : obj;
        let extension = filePath.split(".").pop();
        let fileArray = this.AllowFile;
        let callbackValue = this.CallbackFunc;
        let found = fileArray.find(element => element == extension);

        // Use obj.duration if it exists, otherwise use duration parameter
        const fileDuration = obj.duration || duration;
        const fileThumbnail = obj.thumbnail || thumbnail;

        if (found !== undefined) {
          const triggerData = {
            file: filePath, // Use the constructed filePath
            duration: fileDuration, // Use the selected duration value
            thumbnail: fileThumbnail,
            callback: callbackValue,
          }
          console.log("triggerData",triggerData);
          this.$emit('select-file-trigger', triggerData);
        } else {
          console.log("Callback", callbackValue);
        }
      },
      onContextMenu(e,item,old,id,counting) {
        this.selectItem = id
        e.preventDefault();
        this.$contextmenu({
        zIndex: 99999,
        x: e.x,
        y: e.y,
        items: [
          {
            label: item,
            icon: "fa fa-folder",
            divided: true,
          },
          { 
            label: "เปลี่ยนชื่อโฟลเดอร์", 
            icon: "fa fa-pencil",
            onClick: () => {
              //console.log("Rename",item,id);
              return this.openRenameFolder(item,old,id);
            }
          },
          { 
            label: "Assign Space", 
            icon: "fa fa-key",
            onClick: () => {
              //console.log("Rename",item,id);
              return this.assignSpace(id);
            }
          },
          { 
            label: "ลบโฟลเดอร์", 
            icon: "fa fa-trash",
            onClick: () => {
              //console.log("Delete",item);
              return this.deleteFolder(item,id,counting);
            }
          },
        ]
        });
      },
      onContextDesktopMenu(e) {
        e.preventDefault();
        this.$contextmenu({
        zIndex: 99999,
        x: e.x,
        y: e.y,
        items: [
          { 
            label: "รีเฟรซ", 
            icon: "fa fa-refresh",
            onClick: () => {
              //console.log("New Upload");
              return this.listFile();
            }
          },
          { 
            label: "อัพโหลดไฟล์ใหม่", 
            icon: "fa fa-upload",
            onClick: () => {
              //console.log("New Upload");
              return this.openUploadBox();
            }
          },
          { 
            label: "สร้างโฟลเดอร์", 
            icon: "fa fa-folder",
            onClick: () => {
              //console.log("New Folder");
              return this.openCreateFolder();
            }
          },
        ]
        });
      },
      onFileContextMenu(e, item, old, id, path) {
        console.log(path);
        this.selectItem = id
        e.preventDefault();
        const contextMenuItems = [
          {
            label: item,
            icon: "fa fa-file",
            divided: true,
          },
          {
            label: "เปลี่ยนชื่อ",
            icon: "fa fa-pencil",
            onClick: () => {
              //console.log("Rename", item, id);
              this.openRenameFolder(item, old, id);
            },
          },
          { 
            label: "Assign Space", 
            icon: "fa fa-key",
            onClick: () => {
              //console.log("Rename",item,id);
              return this.assignSpace(id);
            }
          },
        ];

        /*

        if (this.Mode === "popup") {
          contextMenuItems.push({
            label: "เลือกไฟล์",
            icon: "fa fa-check",
            onClick: () => {
              console.log("Select", path);
              this.selectFileFunc(path,duration);
            },
          });
        }

        */

        contextMenuItems.push({
          label: "ย่อขนาดรูป",
          icon: "fa fa-crop",
          onClick: () => {
            //console.log("Select", path);
            this.resizeOption(path,id);
          },
        });

        contextMenuItems.push({
          label: "สร้างรูปหน้าปกวีดีโอ",
          icon: "fa fa-video",
          onClick: () => {
            //console.log("Video", this.schoolSession.s3Endpoint  + path);
            this.captureThumbnail(this.schoolSession.s3Endpoint + path, id);
          },
        });

        /*
        contextMenuItems.push({
          label: "restore",
          icon: "fa fa-refresh",
          onClick: () => {
            console.log("Select", item);
            this.restoreOriginalImage(item);
          },
        });

        */

        contextMenuItems.push({
          label: "ลบไฟล์",
          icon: "fa fa-trash",
          onClick: () => {
            //console.log("Delete", path);
            this.deleteFile(item, id, path);
          },
        });

        this.$contextmenu({
          zIndex: 99999,
          x: e.x,
          y: e.y,
          items: contextMenuItems,
        });
      },
	},
  computed: {
    imageSource() {
      let filePath = this.selectFile.thumbnail || this.selectFile.path;
      return filePath;
    },
    sectionHeight() {
      const windowHeight = window.innerHeight;
      const sectionRatio = 0.6;
      const calculatedHeight = `${windowHeight * sectionRatio}px`;
      return calculatedHeight;
    },
    filteredFileList() {
      const query = this.searchQuery.trim().toLowerCase();
      if (!query) {
        return this.fileListing;
      }
      return this.fileListing.filter((file) => file.name.toLowerCase().includes(query));
    },
    computedDimensions() {
      return this.viewFileDimensions;
    },
    dragItemClass() {
      return this.dragging ? 'dragging' : '';
    },
  },
  async mounted () {
    try {
      await this.listFile()
    } catch (error) {
      console.log(Error);
    }
  }
};
</script>


<template>

    <CreateFolder class="z-[99999]"
    v-if="createFolderModal" 
    :isWindowsOpen="true" 
    @create-folder-trigger="createFolderTrigger" 
    @create-folder-event="createFolder"/>

    <RenameFolder class="z-[99999]"
    v-if="RenameFolderModal" 
    :isWindowsOpen="true" 
    :renameTriggerObj="this.renameTriggerObj" 
    :renameTriggerId="this.renameTriggerId"
    :oldname="this.oldname" 
    @rename-folder-trigger="RenameFolderTrigger" 
    @rename-folder-event="RenameFolder"/>
<!-- 
    <div 
      id="defaultModal" 
      tabindex="-1" 
      class="fixed top-0 left-0 right-0 bottom-0 z-50 w-full h-full p-4 overflow-x-hidden overflow-y-auto flex items-center justify-center md:inset-0 h-modal md:h-full" 
      v-if="showModal"
    >
      <div class="bg-black opacity-75 w-full h-full"></div>
      <div class="relative w-full max-w-2xl md:h-auto">
        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <div class="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
              Preview
            </h3>
            <button 
              @click="showModal = false" 
              type="button" 
              class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" 
              data-modal-hide="defaultModal"
            >
              <span class="sr-only">Close modal</span>
            </button>
          </div>
          <div class="p-6 space-y-6">
            <img :src="viewFilecover" alt="" class="object-cover">
          </div>
        </div>
      </div>
    </div> -->

    <!-- <div v-if="showModal" class="z-[999] fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 overflow-auto" @click="showModal = false">
      <div class="fixed max-h-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 bg-white rounded shadow-md min-w-[20%] ml-[100px] mr-[100px]" @click.stop="">
        <slot>
          
            <div class="z-20 w-full max-h-full bg-white m-auto flex flex-col">
              <div class="fixed top-0 bg-black bg-opacity-50 absolute w-full h-auto bottom z-[999]">
                <div class="p-[10px] h-full text-white text-left text-sm">
                  <strong>File Name : </strong>{{this.viewFilename}} <br>
                  <strong>Upload Date : </strong>{{ formatDate(viewFilecreate) }} <br>
                  <strong>File Size : </strong>{{this.formatBytes(viewFilesize)}} <br>
                </div>
              </div>
              
              <template v-if="modalContent === 'image'">
                <main class="overflow-auto">
                <img :src="selectedFile" alt="" class="w-100 h-full">
              </main>
              </template>
              <template v-else>
                <vue-plyr class="relative">
                  <video ref="videoStreaming" controls crossorigin playsinline class="w-full">
                    <source :src="selectedFile">
                  </video>
                </vue-plyr>
              </template>

            </div>
        </slot>
        <button @click="showModal = false" class="mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
          Close
        </button>
      </div>
    </div> -->

    <!-- Modal overlay -->
    <div v-if="isResizeModalOpen" class="fixed inset-0 flex items-center justify-center z-10 bg-gray-700 bg-opacity-50">
      <!-- Modal for customizing output -->
      <div class="bg-white w-64 rounded shadow-lg">
        <div class="p-2">
          <h2 class="text-xl font-semibold mb-4">ย่อขนาดรูปภาพ</h2>
          
          <!-- File type selection -->
          <label for="fileType" class="block mb-2">เลือกประเภทไฟล์:</label>
          <select v-model="selectedFileType" id="fileType" class="border rounded px-2 py-1 w-full">
            <option value="image/webp">WebP</option>
            <option value="image/jpeg">JPEG</option>
            <option value="image/png">PNG</option>
          </select>

          <div class="pt-2">
            <!-- Quality slider -->
            <label for="quality" class="block mb-2">เลือกความละเอียด:</label>
            <div class="flex items-center">
              <input type="range" v-model="selectedQuality" id="quality" min="0" max="1" step="0.01" class="w-full">
              <span class="ml-2">{{ (selectedQuality * 100).toFixed(0) }}%</span>
            </div>
          </div>

          <!-- Checkbox for replacing or creating a new file -->
          <!-- <div class="inline-flex items-center mt-4 mb-2">
            <input type="checkbox" v-model="replaceExistingFile" id="replaceFile" class="mr-2">
            <label for="replaceFile" class="block">Replace Existing File:</label>
          </div> -->
        </div>

        <!-- Footer section with gray background for buttons -->
        <div class="bg-gray-200 mt-4 p-2 rounded-b">
          <!-- Save and Close buttons -->
          <button @click="isResizeModalOpen=false" class="bg-gray-500 text-white px-2 py-1 rounded mr-2">ปิด</button>
          <button @click="saveOptions" class="bg-blue-500 text-white px-2 py-1 rounded">ปรับขนาด</button>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="fixed top-0 left-0 pt-5 w-full h-full z-10 flex bg-black bg-opacity-75">
      <div class="relative flex flex-col justify-center items-center max-w-[50rem] m-auto shadow-2xl bg-white">

        <button @click="showModal = false" type="button" class="z-50 absolute top-2 right-2">
          <div class="bg-black w-8 h-8 right-2 top-2 leading-8 hover:bg-gray-500">
            <font-awesome-icon :icon="['fas','times']" class="text-white mt-[7px] font-sm"/>
          </div>
        </button>
        
        <div class="w-full md:min-w-[800px] sm:min-w-[300px] min-h-[400px] bg-cover relative flex justify-center items-center bg-gradient-to-t from-stone-900 via-stone-800 to-stone-900">
          <slot>
            <template v-if="modalContent === 'image'">
              <img :src="selectedFile" class="bg-white shadow-lg">
            </template>
            <template v-else>
              <div class="relative">
                <video ref="videoStreaming" controls crossorigin playsinline>
                  <source :src="selectedFile">
                </video>
              </div>
            </template>
          </slot>
        </div>
        
        <!-- Overlay for file details and button -->
        <div class="relative bottom-0 left-0 p-4 bg-white text-white w-full flex flex-col md:flex-row">
          <!-- Left Column for Details -->
          <div class="flex-1 pr-2">
            <div class="text-xs bg-black inline-block p-1 pl-2 pr-2 rounded-sm inline">{{ viewFilename }}</div>
            <div class="text-xs bg-black block p-1 pl-2 pr-2 rounded-sm hidden md:inline ml-1">{{ formatBytes(viewFilesize) }}</div>
          </div>

          <!-- Right Column for Buttons (aligned right) -->
          <div class="flex-1 md:text-right md:pl-2">
            <button v-if="Mode=='popup'" 
              @click="selectFileFunc(viewFileurl, viewFileDuration, viewFileThumbnail)" 
              type="button" 
              class="px-2 py-1 text-white bg-blue-500 rounded shadow-lg hover:bg-blue-600">
              <font-awesome-icon :icon="['fas','check']" class="text-white"/> 
              เลือกไฟล์
            </button>
            <button v-if="Mode=='static'" 
              @click="deleteFile(viewFileurl)" 
              type="button" 
              class="px-2 py-1 text-white bg-red-500 rounded shadow-lg hover:bg-red-600">
              <font-awesome-icon :icon="['fas','trash']" class="text-white"/> 
              ลบไฟล์
            </button>
          </div>
        </div>

      </div>
    </div>

    <!-- <div class="fixed top-0 left-0 bottom-0 right-0 z-10" v-if="showModal">
      <div class="bg-black opacity-75 w-full h-full"></div>
      <div class="z-20 w-11/12 max-h-full bg-white p-20 m-auto flex flex-col shadow-lg">
        <header class="flex justify-between items-center pb-4">
          <h2 class="text-lg font-bold">Modal Title</h2>
          <button @click="showModal = false" class="text-sm font-medium">Close</button>
        </header>
        <main class="overflow-auto">
          <img :src="selectedFile" class="h-full w-full object-cover"/>
        </main>
        <footer class="flex justify-between items-center mt-4">
          <p>Footer Content</p>
          <button @click="showModal = false" class="text-sm font-medium">Close</button>
        </footer>
      </div>
    </div> -->
  
    <header class="py-2 border-gray-800 bg-white">
      <div class="mx-auto max-w-7xl px-2 sm:px-3 lg:px-4 xl:flex xl:items-center xl:justify-between">
        <div class="min-w-0 flex-1">
            <h3 class="text-[18px] font-bold leading-7 text-gray-700 sm:truncate sm:text-[18px] sm:tracking-tight"><font-awesome-icon :icon="['fas',PageIcon]" class="text-gray-500 text-[18px]"/> {{ PageName }}</h3>
        </div>
        <div class="mt-5 flex xl:mt-0 xl:ml-4">
            <span class="hidden sm:block">
              <button @click="listFile" type="button" class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-50">
                <font-awesome-icon :icon="['fas','refresh']" class="text-black text-[12px] mr-2"/> 
                รีเฟรซ
              </button>
            </span>
            <span class="ml-3 hidden sm:block">
              <button @click="openCreateFolder" type="button" class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-50">
                <font-awesome-icon :icon="['fas','folder-plus']" class="text-black text-[12px] mr-2"/> 
                สร้างโฟลเดอร์
              </button>
            </span>
            <span class="ml-3 hidden sm:block">
              <button @click="openUploadBox" type="button" class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-50">
                <font-awesome-icon :icon="['fas','upload']" class="text-black text-[12px] mr-2"/> 
                อัพโหลดไฟล์
              </button>
            </span>

            <span class="ml-3 hidden sm:block" v-if="Mode=='static'">
              <button @click="$router.push('/setup/index')" type="button" class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-50">
                <font-awesome-icon :icon="['fas','home']" class="text-black text-[12px] mr-2"/> 
                ย้อนกลับ
              </button>
            </span>
        </div>
      </div>
    </header>
    

    <div v-if="uploadPanel" class="flex-1 pb-8 bg-gray-100 pt-2 pb-5">
      <div class="mx-auto max-w-7xl px-3 sm:px-3 lg:px-3">
        <div class="overflow-hidden bg-white shadow sm:rounded-lg">
          <div class="px-4 py-5 sm:px-6">
            <h3 class="text-lg font-medium leading-6 text-gray-900">อัพโหลดไฟล์</h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">เลือกไฟล์ที่ต้องการอัพโหลด ห้ามตั้งชื่อไฟล์เป็นภาษาไทย</p>
          </div>
          <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
            <dl class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div class="sm:col-span-2">
                <dt class="text-sm font-medium text-gray-500">ไฟล์ที่เลือกไว้</dt>
                <dd class="mt-1 text-sm text-gray-900">
                  <input type="file" id="files" ref="files" multiple v-on:change="handleFilesUpload()"/>

                  <ul role="list" class="divide-y divide-gray-200 rounded-md border border-gray-200">

                    <li v-for="(file, key) in files" :key="key" class="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
                      <div class="flex w-0 flex-1 items-center">
                        <font-awesome-icon :icon="['fas','paperclip']" class="text-gray-200 text-[18px] mr-2"/>
                        <span class="ml-2 w-0 flex-1 truncate">{{ file.name }}</span>
                      </div>
                      <div class="ml-4 flex-shrink-0">
                        <template v-if="file.status === 'uploading'">
                          <font-awesome-icon :icon="['fas', 'upload']" class="ml-1 text-blue-500"/> กำลังอัพโหลด...
                        </template>
                        <template v-else-if="file.status === 'pending'">
                          <font-awesome-icon :icon="['fas', 'clock']" class="ml-1 text-gray-500"/> รออัพโหลด
                        </template>
                        <template v-else-if="file.status === 'success'">
                          <font-awesome-icon :icon="['fas', 'check']" class="ml-1 text-green-500"/> อัพโหลดแล้ว
                        </template>
                        <template v-else-if="file.status === 'error'">
                          เกิดข้อผิดพลาด!
                        </template>
                        <template v-else>
                          <a v-on:click="submitFiles()" class="cursor-pointer font-medium text-indigo-600 hover:text-indigo-500">Upload All</a>
                        </template>
                        <a v-on:click="removeFile(key)" class="cursor-pointer font-medium text-indigo-600 hover:text-indigo-500 ml-2"> <font-awesome-icon :icon="['fas', 'trash']" class="ml-1 text-red-500"/></a>
                      </div>
                    </li>
                    
                  </ul>
                </dd>
              </div>
            </dl>
          </div>

          <div class="bg-gray-50 px-4 py-3 text-left sm:px-6 border-t">
            <button v-on:click="addFiles()" type="button" class="inline-flex justify-center rounded-md border border-transparent bg-gray-800 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2">
            เลือกไฟล์
            </button>
            <button v-on:click="submitFiles()" type="button" class="ml-5 inline-flex justify-center rounded-md border border-transparent bg-gray-800 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2">
            อัพโหลดไฟล์
            </button>
            <button v-on:click="closeUploadBox()" type="button" class="ml-5 inline-flex justify-center rounded-md border border-transparent bg-gray-800 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2">
            ปิด
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="flex-1 pb-3 bg-gray-100 pt-1 border-t">

        <div class="mx-auto max-w-7xl px-3 sm:px-3 lg:px-3">

          <nav class="flex mb-1 mt-1" aria-label="Breadcrumb">
            <ol role="list" class="flex items-center space-x-1 w-full">
              <li>
                <div>
                  <a 
                  @click="openFolder()" 
                  @dragover.prevent
                  @drop="handleDrop('')"
                  class="text-sm text-gray-400 hover:text-gray-500 cursor-pointer">
                    <font-awesome-icon :icon="['fas','home']" class="text-gray-400 mr-1 w-5"/>
                    Home
                  </a>
                </div>
              </li>
          
              <li v-for="(Path,index) in folderPath" :key="index" class="hidden md:block">
                <div class="flex items-center">
                  <font-awesome-icon :icon="['fas','chevron-right']" class="text-gray-400 w-2"/>
                  <a 
                    v-if="(index+1)==folderPath.length" 
                    :href="'javascript:void(0)'" 
                    class="ml-2 text-sm font-medium text-gray-300 cursor-pointer">
                    <font-awesome-icon :icon="['fas','folder-open']" 
                    class="text-gray-300 mr-1 w-5"/> 
                    {{Path}}
                  </a>
                  <a 
                    v-if="(index+1)!=folderPath.length" 
                    @click="openFolder(getFullPath(Path))"
                    @dragover.prevent
                    @drop="handleDrop(getFullPath(Path))"
                    class="ml-2 text-sm font-medium text-gray-500 hover:text-gray-700 cursor-pointer">
                    <font-awesome-icon :icon="['fas','folder-open']" 
                    class="text-yellow-500 mr-1 w-5"/> 
                    {{Path}}
                  </a>
                </div>
              </li>
            </ol>

            <div class="ml-auto">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="ค้นหาไฟล์..."
                class="px-4 py-2 border border-gray-300 rounded w-46"
              />
            </div>
          </nav>

            <div class="mt-2 flex flex-col">

              <div class="bg-black text-white p-5" v-if="selectFile !== undefined">
                <div class="flex items-center">
                  <div>
                    <img :src="imageSource" alt="Thumbnail" class="h-20 w-20 mr-3 rounded-md" />
                  </div>
                  <div class="block">
                    <div><span class="text-indigo-600 font-semibold">ไฟล์ที่เลือก : </span> {{ selectFile.name }}</div>
                    <div class="mt-3">
                      <button @click="selectFileFunc(selectFile)" type="button" class="mr-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-50">
                        <font-awesome-icon :icon="['fas','check']" class="text-black text-[12px] mr-2"/>
                        เลือก
                      </button>
                      <button @click="selectFile = undefined" type="button" class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-50">
                        <font-awesome-icon :icon="['fas','times']" class="text-black text-[12px] mr-2"/>
                        ยกเลิก
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                  <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 shadow-inner">
                    
                    <div class="flex flex-1 items-stretch overflow-hidden bg-white">
                      
                      <main class="flex-1 overflow-y-auto relative">

                        <div class="mx-auto max-w-7xl pt-8 blocking" :data-content="'กำลังติดต่อฐานข้อมูล กรุณารอสักครู่.....'" :class="[(activeBlock?'isblock' : 'isunblock')]">
                          
                          <section :style="{ height: sectionHeight }" 
                          class="flex flex-col relative" 
                          aria-labelledby="gallery-heading"
                          @click.stop="unselectItem()"
                          @contextmenu.stop="onContextDesktopMenu($event)"
                          >
                           <!-- <pre>{{ fileListing }}</pre> -->

                            <h2 id="gallery-heading" class="sr-only">Recently viewed</h2>
                            <form>
                              <ul role="list" id="fileList" class="grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-3 sm:gap-x-4 lg:grid-cols-3 xl:gap-x-4 px-2 py-2" :class="[(showFileDetail?'md:grid-cols-6 xl:grid-cols-6' : 'md:grid-cols-6 xl:grid-cols-6')]">
                                
                                <li v-for="(file) in filteredFileList" :key="file.title" class="relative" :class="{ 'selected': file._id === selectItem }">

                                  <div v-if="file.mimetype === 'folder'"
                                  :class="'folder-' + file._id"
                                  @dragover.prevent
                                  @drop.stop="handleDrop(file.path)"
                                  @click.stop="openViewFile(file.name)"
                                  :data-item="file.path"
                                  :ref="`dropTarget-${file.path}`"
                                  class="folder-container flex flex-col items-center justify-center cursor-pointer" 
                                  >
                                      <div class="folder-content"
                                      @contextmenu.stop="onContextMenu($event, file.name, file.name, file._id, file.count)"
                                      @dblclick.stop="openFolder(file.path)"
                                      >
                                        <div class="icon-container relative">
                                          <font-awesome-icon :icon="['fas', 'folder']" class="text-yellow-500 text-[120px]" />
                                          <button type="button" class="absolute inset-0 focus:outline-none">
                                            <span class="bg-yellow-600 rounded-lg text-sm p-1 pl-2 pr-2 text-white top-[10px] left-0 text-center relative">{{file.count}} ไฟล์</span>
                                          </button>
                                        </div>
                                        <p class="pointer-events-none mt-2 block truncate text-sm font-medium text-gray-900 max-w-[120px]">{{file.name}}</p>
                                        <p class="pointer-events-none block text-xs font-medium text-gray-500">{{ this.formatBytes(file.size) }}</p>
                                      </div>
                                  </div>

                                  <div v-if="file.mimetype!='folder'"
                                  draggable="true"
                                  @dragstart.stop="handleDragStart(file._id)"
                                  @dragend.stop="handleDragEnd"
                                  :data-item="file._id"
                                  :ref="`draggableItem-${file._id}`"
                                  :class="['cursor-pointer','overflow-hidden', dragItemClass]"
                                  >
                                    <div v-if="file.type=='image'" @contextmenu.stop="onFileContextMenu($event, file.name, file.name, file._id, file.original)" @dblclick.stop="onDoubleClick(file.name)" @click.stop="openViewFile(file.name)" class="h-[120px] ring-offset-2 group block w-full aspect-w-10 aspect-h-7 rounded-md overflow-hidden">
                                      
                                      <div class="grid place-items-center">
                                        <font-awesome-icon :icon="['fas', 'image']" class="opacity-70 absolute top-12 p-3 bg-indigo-500 rounded-full text-white text-[20px]" />
                                        <img :src="file.thumbnail ? file.thumbnail : file.path" alt="" class="rounded-lg p-1 object-cover w-full h-full pointer-events-none">
                                      </div>

                                      <button type="button" class="absolute inset-0 focus:outline-none">
                                        <span class="sr-only">View details for {{file.name}}</span>
                                      </button>
                                    </div>

                                    <div v-if="file.type=='document'" @contextmenu.stop="onFileContextMenu($event, file.name, file.name, file._id, file.original)" @dblclick.stop="onDoubleClick(file.name)"  @click.stop="openViewFile(file.name)" class="h-[120px] ring-offset-2 group block w-full aspect-w-10 aspect-h-7 rounded-md overflow-hidden">
                                      
                                      <div class="grid place-items-center">
                                        <div
                                          :class="{
                                            'bg-gray-500': ['default', 'txt'].includes(getNewFileExtension(file.name)), // Default background color or txt file
                                            'bg-red-500': getNewFileExtension(file.name) === 'pdf',
                                            'bg-green-500': ['xlsx', 'xls'].includes(getNewFileExtension(file.name)),
                                            'bg-blue-500': ['docx', 'doc'].includes(getNewFileExtension(file.name)),
                                            'bg-purple-500': ['pptx', 'ppt'].includes(getNewFileExtension(file.name)),
                                            'bg-black': getNewFileExtension(file.name) === 'csv',
                                            'bg-orange-500': getNewFileExtension(file.name) === 'js',
                                            'bg-yellow-500': getNewFileExtension(file.name) === 'zip',
                                            'bg-pink-500': ['jpg', 'jpeg', 'png', 'gif'].includes(getNewFileExtension(file.name)), // Add more image formats
                                            'bg-brown-500': ['html', 'htm'].includes(getNewFileExtension(file.name)), // HTML files
                                            'bg-cyan-500': ['xml'].includes(getNewFileExtension(file.name)), // XML files
                                          }"
                                          class="opacity-70 absolute top-22 p-1 rounded-lg text-sm text-white min-w-[40px] text-center"
                                        >
                                          {{ getNewFileExtension(file.name) }}
                                        </div>
                                        <font-awesome-icon :icon="['fas','file']" class="p-1 text-gray-300 text-[120px]"/>
                                      </div>
                                      <button type="button" class="absolute inset-0 focus:outline-none">
                                        <span class="sr-only">View details for {{file.name}}</span>
                                      </button>
                                    </div>

                                    <div v-if="file.type=='media'" @contextmenu.stop="onFileContextMenu($event, file.name, file.name, file._id, file.original, file.duration)" @dblclick.stop="onDoubleClick(file.name)"  @click.stop="openViewFile(file.name)" class="h-[120px] ring-offset-2 group block w-full aspect-w-10 aspect-h-7 rounded-md overflow-hidden">
                                      <template v-if="file.thumbnail">
                                        <div class="grid place-items-center">
                                          <font-awesome-icon :icon="['fas', 'play-circle']" class="opacity-70 absolute top-12 p-3 bg-red-500 rounded-full text-white text-[20px]" />
                                          <img :src="file.thumbnail" alt="" class="rounded-lg p-1 object-cover w-full h-full pointer-events-none" />
                                        </div>
                                      </template>
                                      <template v-else>
                                        <!-- If file.thumbnail is empty, display the font-awesome-icon -->
                                        <font-awesome-icon :icon="['fas', 'file-video']" class="p-1 text-gray-300 text-[120px]" />
                                      </template>
                                      <button type="button" class="absolute inset-0 focus:outline-none">
                                        <span class="sr-only">View details for {{file.name}}</span>
                                      </button>
                                    </div>
                                  
                                    <div v-if="Mode === 'popup' && isAllowedFile(file.name)">
                                      <div class="mt-2 block truncate text-sm font-medium text-gray-900">
                                        <label class="block pl-1 pt-2 pb-2 pr-2">
                                          <input type="radio" :value="file" v-model="selectFile" class="radio-input border-2 border-black" /> {{ file.name }}
                                        </label>
                                      </div>
                                      <p class="ml-1 pointer-events-none block text-sm font-medium text-gray-500">{{ this.formatBytes(file.size) }}</p>
                                    </div>

                                    <div v-else class="px-2">
                                      <p class="mt-2 block text-sm font-medium text-gray-900 truncate">
                                        <span class="text-black">{{ getFileName(file.name) }}</span>
                                        <span class="text-gray-600">{{ getFileExtension(file.name) }}</span>
                                      </p>
                                      <p class="pointer-events-none block text-xs font-medium text-gray-500">
                                        <span style="float: left;">{{ this.formatBytes(file.size) }}</span>
                                        <span v-if="file.type=='media'" style="float: right;">{{ formatDuration(file.duration) }}</span>
                                      </p>
                                    </div>
                                  </div>

                                </li>

                              </ul>
                            </form>

                          </section>

                        </div>
                        
                      </main>

                      <aside v-if="showFileDetail" class="hidden w-96 overflow-y-auto border-l border-gray-200 bg-white p-8 lg:block">

                        <div class="space-y-6 pb-16">
                          
                          <div class="relative"> 

                            <div v-if="showFilePreview" class="aspect-w-10 aspect-h-7 block w-full overflow-hidden rounded-lg">
                              <img :src="viewFilecover" alt="" class="object-cover">
                            </div>

                          </div>
                          <div>
                            <dl class="mt-2 divide-y divide-gray-200 border-t border-b border-gray-200">
                              <div class="flex justify-between py-3 text-sm font-medium">
                                <dt class="text-gray-500 truncate">{{viewFilename}}</dt>
                              </div>

                              <div class="flex justify-between py-3 text-sm font-medium">
                                <dt class="text-gray-500">อัพโหลดโดย</dt>
                                <dd class="whitespace-nowrap text-gray-900">Marie Culver</dd>
                              </div>

                              <div class="flex justify-between py-3 text-sm font-medium">
                                <dt class="text-gray-500">วันที่อัพโหลด</dt>
                                <dd class="whitespace-nowrap text-gray-900">{{ formatDate(viewFilecreate) }}</dd>
                              </div>

                              <div class="flex justify-between py-3 text-sm font-medium">
                                <dt class="text-gray-500">ขนาดไฟล์</dt>
                                <dd class="whitespace-nowrap text-gray-900">{{this.formatBytes(viewFilesize)}}</dd>
                              </div>
                            </dl>
                          </div>
                          <div class="flex">
                            <button v-if="Mode=='popup'" 
                            @click="selectFileFunc(viewFileurl, viewFileDuration, viewFileThumbnail)" 
                            type="button" 
                            class="flex-1 rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                            <font-awesome-icon :icon="['fas','check']" class="text-white"/> 
                            เลือกไฟล์
                            </button>

                            <button 
                            @click="closeViewFile" 
                            type="button" 
                            class="ml-3 flex-1 rounded-md border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                            ปิด
                            </button>
                            <button 
                            @click="deleteFile(viewFileurl)" 
                            type="button" 
                            class="ml-3 flex-1 rounded-md border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                            <font-awesome-icon :icon="['fas','trash']" class="text-gray-500"/> </button>
                          </div>
                        </div>
                      </aside>
                    </div>
                    <div class="pb-2 h-10 border-t border-gray-200 bg-gray-50 w-full grid grid-cols-2">
                      <!-- First Column -->
                      <div class="col-span-1 p-1 pl-2 pt-3 text-gray-600 text-sm" v-if="hasSelected && selectItemData.type!='folder'">
                        File Select : {{ selectItemData.name }}
                      </div>
                      <div class="col-span-1 p-1 pl-2 pt-3 text-gray-600 text-sm" v-else>
                        <strong>ใช้พื้นที่ :</strong> {{ formatBytes(summaryFileSize) }} / {{space}} MB ({{ calculateDiskUsagePercentage(summaryFileSize) }}%)
                      </div>
                    
                      <!-- Second Column -->
                      <div class="col-span-1 p-1 pl-2 pr-3 pt-3 text-red-600 text-sm text-right" v-if="error">
                        <span class="inline-block"><strong>เกิดข้อผิดพลาด</strong> : {{ errorText }}</span>
                        <button @click="error = false" class="ml-3 inline-block font-bold">X</button>
                      </div>
                    </div>
                    
                  </div>
                </div>
              </div>
            </div>
        </div>
    </div>

</template>

<style scoped>
  input[type="file"]{
    position: absolute;
    top: -500px;
  }

  div.file-listing{
    width: 200px;
  }

  span.remove-file{
    color: red;
    cursor: pointer;
    float: right;
  }

  .overflow-auto {
    max-height: calc(100% - 140px);
  }
  .dragging {
    opacity: 0.4; /* Adjust the opacity value as desired */
  }
  .selected{
    border: 1px solid #b3ddff;
    padding: 0px;
    border-radius: 5px;
    background: #e1f2ff;
  }
  .mx-context-menu-item-wrapper {
    position: relative;
    max-width: 200px;
  }
</style>