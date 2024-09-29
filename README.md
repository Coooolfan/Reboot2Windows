# Reboot to Windows / 一键重启到Windows

This is a small Gnome extension that adds the ability to reboot directly to the Windows when using grub. support Chinese and English.

此Gnome扩展允许您从重启菜单中一键重启到Windows。支持中文和英文。

> [!NOTE]
>
> This project has only been tested on Arch Linux, but should work with all Linux distributions that use grub.
> If you encounter any issues while using it, please feel free to contact me. I am more than happy to help you troubleshoot.
>
> 此项目仅在Arch Linux上进行了测试，但应该适用于所有使用grub的Linux发行版。
> 如果您在使用中遇到任何问题，请随时联系我。很乐意帮助您解决问题。

![Screenshot of the extension option in the Gnome 45.1 menu](images/screenshot.png)


#### Q： I installed the plugin, but the menu is not appearing. What should I do? / 我安装了插件后没有出现该菜单？

A：Gnome may have all extensions disabled by default. Please find "Extensions" in your application library, enable extension functionality, and enable the "reboot2win" extension.

Gnome可能默认关闭了所有扩展，请在你的程序库中找到`扩展`启用扩展功能，并启用reboot2win扩展。

# Installation / 安装

> [!NOTE]
>
> 此插件已提交到Gnome官方扩展商店审核～

### Download / 下载插件

You can clone the project from GitHub. 
从GitHub克隆该存储库。

`$ git clone https://github.com/Coooolfan/Reboot2Windows`

### Build / 构建插件

If you want to build the plugin, run the following command:

要构建插件，请运行以下命令：

`$ sh build.sh`

If everything goes well, a zip file will be generated in the project folder.

如果一切顺利，这将在项目文件夹中生成一个zip文件。

### Install / 安装插件

To install the plugin, simply run the install.sh script with the following command:

要安装插件，只需运行install.sh脚本，并使用以下命令：

`$ sh install.sh`


### Acknowledgements


Despite the roughness of this plugin, I am still very grateful to all the friends who have shared their experiences online.

Special thanks to the author of reboottouefi for open-sourcing the plugin at [reboottouefi](https://github.com/UbayGD/reboottouefi). 

I would also like to express my gratitude to the friends within the archlinuxcn community who have generously contributed their time, helping me troubleshoot various issues during the plugin development process.

# for Developer

<https://gjs.guide/extensions/#introduction> 