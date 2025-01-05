using Server.DTOs.Post;

namespace Server.Modules
{
    public static class FileValidationHelper
    {
        private static readonly long MAXSIZE = 5 * 1024 * 1024;
        private static readonly HashSet<string> ImageMimeTypes = new()
        {
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/webp",
            "image/bmp"
        };

        private static readonly HashSet<string> VideoMimeTypes = new()
        {
            "video/mp4",
            "video/x-msvideo",
            "video/quicktime",
            "video/x-matroska"
        };

        /// <summary>
        /// Kiểm tra file có phải là ảnh hoặc video dựa trên MIME type
        /// </summary>
        public static bool IsImageOrVideo(string contentType)
        {
            return IsImage(contentType) || IsVideo(contentType);
        }

        /// <summary>
        /// Kiểm tra file có phải là ảnh dựa trên MIME type
        /// </summary>
        public static bool IsImage(string contentType)
        {
            return ImageMimeTypes.Contains(contentType);
        }

        /// <summary>
        /// Kiểm tra file có phải là video dựa trên MIME type
        /// </summary>
        public static bool IsVideo(string contentType)
        {
            return VideoMimeTypes.Contains(contentType);
        }
        public static bool IsValidSize(long size)
        {
            return (size < MAXSIZE);
        }

        public static bool IsValidListMedia(List<IFormFile> files)
        {
            foreach (var file in files)
            {
                if (!FileValidationHelper.IsImageOrVideo(file.ContentType))
                {
                    throw new Exception($"File-File '{file.FileName}' is invalid type");
                }

                if (!FileValidationHelper.IsValidSize(file.Length))
                {
                    throw new Exception($"File-File '{file.FileName}' is over size");
                }

            }
            return true;
        }

        public static List<FileInfoDto> GetFilesInfo(List<IFormFile> files)
        {
            var fileInfoList = new List<FileInfoDto>();

            if (files == null || files.Count == 0)
            {
                return fileInfoList; // Trả về danh sách rỗng nếu không có file
            }

            foreach (var file in files)
            {
                fileInfoList.Add(new FileInfoDto
                {
                    Name = file.FileName,
                    Type = file.ContentType
                });
            }

            return fileInfoList;
        }
    }
}
