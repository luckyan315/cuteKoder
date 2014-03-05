#ifndef _MYOBJECT_H_
#define _MYOBJECT_H_

#include <node.h>

class MyObject : public node::ObjectWrap
{
public:
	static void Init();
	static v8::Handle<v8::Value> NewInstance(const v8::Arguments& args);
	double Value() const { return m_value; }
	
	
private:
    MyObject(double value = 0);
    virtual ~MyObject();

	static v8::Handle<v8::Value> New(const v8::Arguments& args);
	static v8::Persistent<v8::Function> constructor;

	double m_value;
	
};

#endif /* _MYOBJECT_H_ */
