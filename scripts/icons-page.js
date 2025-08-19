'use strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory
const imagesDir = path.join(__dirname, '../src/img/svg');

fs.readdir(imagesDir, (err, files) => {
    if (err) {
        console.error(err);
    }
    const imageFiles = files.filter(file => /\.(svg)$/i.test(file));

    const imagesHtml = imageFiles.map(file => {
        const srcPath = `${file}`;
        const name = file.split('.')[0];
        return `
    <div class="icon" style="padding: 10px; outline: 1px solid silver" title="${file}" data-name="${name}">
        <img src="${srcPath}" style="max-width:200px; margin:10px;" alt="file">
    </div>
    `;
    }).join('\n');

    const html = `
            <!DOCTYPE html>
            <html lang="ru">
            <head>
                <meta charset="UTF-8" />
                <title>Icons</title>
                <style>
                .wrapper {
                    display:flex;
                    flex-wrap:wrap;
                    background: antiquewhite;
                }
                .icon {
                    cursor: pointer;
                }
                input[type='checkbox']:checked + .wrapper {
                    background: #000;
                }
                .notification-wrapper {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                }
                .note {
                    background: wheat;
                    padding: 20px;
                    box-sizing: border-box;
                    transform: translateY(100%);
                    transition: .5s;
                    &.show {
                        transform: translateY(0);
                    }
                }
                </style>
            </head>
            <body>
                <h1>Icons</h1>
                <label for="invert">Invert</label>
                <input type="checkbox" id="invert"/>
                <div class="wrapper">
                    ${imagesHtml}
                </div>
                <script>
                    document.addEventListener('DOMContentLoaded',() => {
                        const note = document.querySelector('.note');
                    document.querySelectorAll('.icon').forEach(el => {
                        el.addEventListener('click', () => {
                            const {name} = el.dataset;
                            navigator.clipboard.writeText(name).then(() => {
                                 note.innerHTML = "<strong>"+ name +"</strong> copied to clipboard";
                                 note.classList.add('show');
                                 setTimeout(() =>{note.classList.remove('show')}, 2000);
                            });

                        })
                    });
                    });
                </script>
                <div class="notification-wrapper"><div class="note"></div></div>
            </body>
            </html>
        `;

    fs.writeFile(`${imagesDir}/icons.html`, html, (err) => {});
})
