cmd_Release/obj.target/objects.node := flock ./Release/linker.lock g++ -shared -pthread -rdynamic -m32  -Wl,-soname=objects.node -o Release/obj.target/objects.node -Wl,--start-group Release/obj.target/objects/addon.o Release/obj.target/objects/myobject.o -Wl,--end-group 