cmd_Release/obj.target/callback.node := flock ./Release/linker.lock g++ -shared -pthread -rdynamic -m32  -Wl,-soname=callback.node -o Release/obj.target/callback.node -Wl,--start-group Release/obj.target/callback/cb.o -Wl,--end-group 
