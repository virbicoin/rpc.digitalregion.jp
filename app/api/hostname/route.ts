import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET() {
  try {
    // hostnameコマンドでLinuxのホスト名を取得
    const { stdout } = await execAsync('hostname');
    const hostname = stdout.trim();
    
    return NextResponse.json({ 
      hostname,
      success: true 
    });
  } catch (error) {
    console.error('Failed to get hostname:', error);
    return NextResponse.json({ 
      hostname: 'unknown',
      success: false,
      error: 'Failed to get hostname'
    }, { status: 500 });
  }
}
