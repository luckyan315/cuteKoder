#define BUILDING_NODE_EXTENSION
#include <node.h>
#include "myobject.h"

using namespace v8;

void initAll(Handle<Object> exports) {
	MyObject::Init(exports);
}

NODE_MODULE(addon, initAll)
